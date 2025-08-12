import React from 'react';
import { Dialog } from 'primereact/dialog';
import { cn } from '../../lib/utils';

interface ResponsiveDialogProps {
    visible: boolean;
    onHide: () => void;
    header?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    footer?: React.ReactNode;
    closeOnEscape?: boolean;
    closable?: boolean;
    maskClosable?: boolean;
    resizable?: boolean;
    maximizable?: boolean;
    blockScroll?: boolean;
    baseZIndex?: number;
    autoZIndex?: boolean;
    focusOnShow?: boolean;
    focusTrap?: boolean;
    breakpoints?: { [key: string]: string };
    style?: React.CSSProperties;
}

export const ResponsiveDialog: React.FC<ResponsiveDialogProps> = ({
    visible,
    onHide,
    header,
    children,
    className,
    headerClassName,
    contentClassName,
    footer,
    closeOnEscape = true,
    closable = true,
    maskClosable = true,
    resizable = false,
    maximizable = false,
    blockScroll = true,
    baseZIndex = 1000,
    autoZIndex = true,
    focusOnShow = true,
    focusTrap = true,
    breakpoints = {
        '960px': '75vw',
        '641px': '90vw',
        '480px': '95vw'
    },
    style
}) => {
    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={header}
            footer={footer}
            className={cn('p-0', className)}
            headerClassName={cn('border-b border-gray-200 p-4 sm:p-6', headerClassName)}
            contentClassName={cn('p-4 sm:p-6', contentClassName)}
            closeOnEscape={closeOnEscape}
            closable={closable}
            maskClosable={maskClosable}
            resizable={resizable}
            maximizable={maximizable}
            blockScroll={blockScroll}
            baseZIndex={baseZIndex}
            autoZIndex={autoZIndex}
            focusOnShow={focusOnShow}
            focusTrap={focusTrap}
            breakpoints={breakpoints}
            style={style}
            modal
            draggable={false}
        >
            {children}
        </Dialog>
    );
};

export default ResponsiveDialog;
