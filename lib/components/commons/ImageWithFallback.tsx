'use client';

import { WarningOutlined } from '@ant-design/icons';
import { EMPTY_STRING } from '@lib/configs/constants';
import Image, { ImageProps } from 'next/image';
import React, { memo, useEffect, useState } from 'react';

import { isURLValid } from '@shared/utils/helper';

interface ImageWithFallbackProps extends Partial<ImageProps> {
	src?: string;
}
const ImageWithFallback = ({ src = EMPTY_STRING, alt = 'image', ...restProps }: ImageWithFallbackProps) => {
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		setHasError(!isURLValid(src as string));
	}, [src]);
	const shouldRenderImage = src && !hasError;
	return (
		<div className="relative w-full h-full">
			{shouldRenderImage ? (
				<Image {...restProps} src={src} alt={alt} onError={() => setHasError(true)} />
			) : (
				<WarningOutlined />
			)}
		</div>
	);
};

export default memo(ImageWithFallback);
