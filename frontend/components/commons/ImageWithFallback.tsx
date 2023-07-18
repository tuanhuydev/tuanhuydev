'use client';

import { WarningOutlined } from '@ant-design/icons';
import Image, { ImageProps } from 'next/image';
import React, { memo, useEffect, useState } from 'react';

import { isURLValid } from '@shared/utils/helper';

const ImageWithFallback = ({ src, alt = 'image', ...restProps }: ImageProps) => {
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		setHasError(!isURLValid(src as string));
	}, [src]);

	return (
		<div>
			{hasError ? <WarningOutlined /> : <Image {...restProps} src={src} alt={alt} onError={() => setHasError(true)} />}
		</div>
	);
};

export default memo(ImageWithFallback);
