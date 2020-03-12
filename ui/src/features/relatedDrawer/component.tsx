import React from "react";
import {
    Drawer, Intent, NonIdealState, Spinner
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
    onClose,
}: props) {
    console.log(title);
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