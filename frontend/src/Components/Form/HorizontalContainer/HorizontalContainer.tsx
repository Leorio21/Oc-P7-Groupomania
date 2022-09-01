import classNames from "classnames";
import { ReactElement } from "react";
import cn from './HorizontalContainer.module.scss'

interface HorizontalContainerProps {
    children: ReactElement[]
}

const HorizontalContainer = ({children}: HorizontalContainerProps) => {

    return (
        <div className={classNames(cn.container)}>
            {children}
        </div>
    )
}

export default HorizontalContainer;