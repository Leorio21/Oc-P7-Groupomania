import classNames from "classnames";
import { PropsWithChildren } from "react";
import cn from './HorizontalContainer.module.scss'

interface HorizontalContainerProps extends PropsWithChildren {
}

const HorizontalContainer = ({children}: HorizontalContainerProps) => {

    return (
        <div className={classNames(cn.container)}>
            {children}
        </div>
    )
}

export default HorizontalContainer;