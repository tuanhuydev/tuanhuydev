import React, { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	variant?: 'fill' | 'outline' | 'link';
	label: string;
	children?: ReactNode;
	loading?: boolean;
}

export default function Button({
	variant = 'fill',
	loading = false,
	label,
	prefix,
	children,
	...restProps
}: ButtonProps) {
	const getStyles = (variant: string) => {
		if (variant === 'outline') return 'bg-transparent border-primary text-primary';
		if (variant === 'link') return 'bg-transparent border-primary	text-primary';
		return 'bg-primary text-slate-50 hover:brightness-90';
	};

	return (
		<button
			className={`py-1 px-3 rounded-md border transition-all capitalize cursor-pointer ${getStyles(variant)}`}
			{...restProps}>
			{children || <span>{label}</span>}
		</button>
	);
}
