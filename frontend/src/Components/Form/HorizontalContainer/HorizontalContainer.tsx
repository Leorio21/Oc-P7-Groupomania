import classNames from "classnames";
import React, { PropsWithChildren } from "react";
import cn from "./HorizontalContainer.module.scss";

type HorizontalContainerProps = PropsWithChildren

const HorizontalContainer = ({children}: HorizontalContainerProps) => {

    return (
        <div className={classNames(cn.container)}>
            {children}
        </div>
    );
};

export default HorizontalContainer;