"use client";

import BaseButton from "../commons/buttons/BaseButton";
import { makeFieldMap } from "@app/_utils/helper";
import { useCreatePost, useUpdatePost } from "@app/queries/postQueries";
import Loader from "@components/commons/Loader";
import { EMPTY_STRING } from "@lib/configs/constants";
import LogService from "@lib/services/LogService";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { Post, PostAsset } from "@prisma/client";
import BaseError from "@shared/commons/errors/BaseError";
import { isURLValid, transformTextToDashed } from "@shared/utils/helper";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { Form, Tabs, TabsProps, notification } from "antd";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";

const BaseMarkdown = dynamic(() => import("@components/commons/BaseMarkdown"), {
  ssr: false,
  loading: () => <Loader />,
});

const PostPreview = dynamic(() => import("./PostPreview"), { ssr: false });

const Upload = dynamic(() => import("antd/es/upload"), { ssr: false });

const Input = dynamic(() => import("antd/es/input"), { ssr: false });

const initialValues = {
  title: EMPTY_STRING,
  slug: EMPTY_STRING,
  content: EMPTY_STRING,
  thumbnail: EMPTY_STRING,
};

const rules = [{ required: true, message: "This field is required" }];

export default function PostForm({ post }: any) {
  const {
    mutate: mutateCreatePost,
    isPending: isCreating,
    isSuccess: createSuccess,
    isError: createError,
  } = useCreatePost();

  const {
    mutate: mutateUpdatePost,
    isPending: isUpdating,
    isSuccess: updateSuccess,
    isError: updateError,
  } = useUpdatePost();

  // Hooks
  const [form] = Form.useForm();
  const router = useRouter();
  const queryClient = useQueryClient();

  // State
  const [content, setContent] = useState<string>(EMPTY_STRING);
  const [disabledUpload, setDisabledUpload] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [assets, setAssets] = useState([]);
  const [previewValue, setPreviewValue] = useState<ObjectType>({});

  const editorRef = useRef<MDXEditorMethods | null>(null);
  const submitting = isCreating || isUpdating;
  const isUpdatingPost = !!post;

  const createPost = useCallback(
    (formData: ObjectType) => {
      try {
        mutateCreatePost(formData);
      } catch (error) {
        LogService.log(error);
      } finally {
        form.resetFields();
        setContent(EMPTY_STRING);
      }
    },
    [form, mutateCreatePost],
  );

  const updatePost = useCallback(
    async (formData: any) => {
      try {
        const postToUpdate = { id: post.id as number, ...formData };
        mutateUpdatePost(postToUpdate);
        queryClient.removeQueries(["posts", post.id] as InvalidateQueryFilters);
      } catch (error) {
        LogService.log(error);
      } finally {
        setContent(EMPTY_STRING);
      }
    },
    [mutateUpdatePost, post?.id, queryClient],
  );

  const submit = useCallback(
    async (formData: ObjectType) => {
      formData.assets = assets;
      if (isUpdatingPost) return updatePost(formData);

      formData.publishedAt = new Date();
      return createPost(formData);
    },
    [assets, createPost, isUpdatingPost, updatePost],
  );

  const handleFieldChange = useCallback(
    (changedFields: Array<ObjectType>, allFields: Array<ObjectType>) => {
      const changedMap = makeFieldMap(changedFields);
      const fieldsMap = makeFieldMap(allFields);

      // Make slug from title
      const hasTitleButNoSlug = changedMap.has("title") && !changedMap.has("slug");
      if (hasTitleButNoSlug && changedMap.get("title").value) {
        const dashedSlug = transformTextToDashed(changedMap.get("title").value);
        form.setFieldValue("slug", dashedSlug);
      }
      // Disabled upload if there is a thumbnail
      setDisabledUpload(fieldsMap.has("thumbnail") && fieldsMap.get("thumbnail").value);
    },
    [form],
  );

  const mapFormToPreview = (changedValue: any, value: any) => {
    if (changedValue) setPreviewValue(value);
  };

  const updatePostAssets = useCallback((asset: ObjectType) => {
    setAssets((prevAssets) => [...prevAssets, asset.id] as never);
  }, []);

  const triggerSubmit = useCallback(() => {
    form.submit();
  }, [form]);

  const uploadFile = ({ file, fileList }: any) => {
    setFileList(fileList);
    const { response = {}, error } = file;
    const { data: asset } = response;
    if (error) notification.error({ message: (error as BaseError).message });
    if (asset) {
      updatePostAssets(asset);
      form.setFieldValue("thumbnail", asset.url);

      setFileList([]);
      setDisabledUpload(true);
    }
  };

  const validateUrl = (ruleObject: any, value: string) => {
    return isURLValid(value) || !value ? Promise.resolve() : Promise.reject(new Error("Please enter a valid URL"));
  };

  useEffect(() => {
    const updateContentInterval = setInterval(() => {
      form.setFieldsValue({ content: content });
      setPreviewValue((prevContent) => ({ ...prevContent, content } as never));
    }, 1000);
    return () => clearInterval(updateContentInterval);
  }, [content, form]);

  useEffect(() => {
    if (isUpdatingPost) {
      for (let [key, value] of Object.entries(post)) {
        form.setFieldValue(key, value);
        if (key === "content") {
          setContent(value as string);
          editorRef.current?.setMarkdown(value as string);
        } else if (key === "PostAsset") {
          const assets = (value as Array<Partial<PostAsset>>).map(({ assetId }) => assetId);
          setAssets(assets as never);
        }
      }
      setPreviewValue(form.getFieldsValue());
    }
  }, [form, isUpdatingPost, post]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      router.back();
    }
    if (createError || updateError) {
      notification?.error({ message: "Save post failed" });
    }
  }, [createError, createSuccess, router, updateError, updateSuccess]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Editor",
      children: (
        <div className="grid grid-cols-4 lg:grid-cols-12 grid-rows-1 gap-4" data-testid="post-form-testid">
          <div className="col-span-full lg:col-span-10 p-2">
            <Form
              form={form}
              layout="vertical"
              initialValues={initialValues}
              onFieldsChange={handleFieldChange}
              onValuesChange={mapFormToPreview}
              onFinish={submit}>
              <Form.Item name="title" rules={rules}>
                <Input placeholder="How to make a new blog ?" size="large" className="mb-2" disabled={submitting} />
              </Form.Item>
              <Form.Item name="slug" rules={rules}>
                <Input placeholder="how-to-make-a-new-blog" size="large" className="mb-2" disabled={submitting} />
              </Form.Item>
              <div className="flex items-center transition-all">
                <Form.Item name="thumbnail" className="grow" rules={[{ validator: validateUrl }]}>
                  <Input placeholder="https://image-link-url" size="large" disabled={submitting} />
                </Form.Item>
                <div className="mb-6 flex items-center">
                  <div className="mx-3 text-slate-500">Or</div>
                  <Upload
                    name="file"
                    className="w-full"
                    onChange={uploadFile}
                    fileList={fileList}
                    action="/api/upload/image"
                    headers={{ Authorization: `Bearer ${Cookies.get("jwt")}` }}
                    accept="image/png, image/jpeg"
                    multiple={false}
                    listType="picture"
                    disabled={disabledUpload}>
                    <BaseButton label="Upload Image" disabled={true} />
                  </Upload>
                </div>
              </div>
              <Form.Item name="content" rules={rules}>
                <Suspense fallback={<Loader />}>
                  <BaseMarkdown
                    onChange={(value: string) => setContent(value)}
                    placeholder="Post content here..."
                    value={content}
                    className="min-h-[20rem] grow"
                  />
                </Suspense>
              </Form.Item>
            </Form>
          </div>
          <div className="col-span-full md:col-span-1 lg:col-span-full row-start-auto col-start-1 lg:col-start-11 gap-3 flex lg:flex-col p-2">
            <BaseButton
              onClick={triggerSubmit}
              disabled={submitting}
              loading={submitting}
              label={isUpdatingPost ? "Save" : "Publish"}
              className="bg-primary text-slate-100 capitalize mb-2"
            />
            {!post?.publishedAt && (
              <BaseButton variants="outline" onClick={triggerSubmit} label="Save Draft" disabled={submitting} />
            )}
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Preview",
      children: <PostPreview post={previewValue as unknown as Post} />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
}
