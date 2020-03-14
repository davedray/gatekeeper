import React, {useEffect} from "react";
import {
    Drawer, Intent, Spinner
} from "@blueprintjs/core";
import { IconName } from "@blueprintjs/icons"
import './style.scss'
interface props {
    actions?: React.ReactNodeArray;
    children: React.ReactNode;
    emptyState: React.ReactNode;
    hasChildren: boolean;
    icon?: IconName;
    title: string;
    isLoading: boolean;
    isOpen: boolean;
    onOpen?: () => any;
    onClose: () => any;
};

function RelatedDrawer({
    actions,
    children,
    emptyState,
    hasChildren,
    icon,
    title,
    isLoading,
    isOpen,
    onOpen,
    onClose,
}: props) {
    useEffect(() => {
        if (isOpen && onOpen && !isLoading) {
            console.log('calling onopen');
            onOpen();
        }
    }, [isOpen, onOpen, isLoading]);
    return (
        <Drawer
            icon={icon}
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            { isLoading ? (
                <span className="relatedDrawer__spinner">
                <Spinner
                    size={200}
                    intent={Intent.PRIMARY}
                />
                </span>
            ) : (
                hasChildren ? children : emptyState
            )}
            { actions }
        </Drawer>
    );
}

export default RelatedDrawer;