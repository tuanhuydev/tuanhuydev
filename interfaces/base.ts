export interface ComponentProps {
    children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined;
}

export interface ObjectType {
    [key: string]: any;
}