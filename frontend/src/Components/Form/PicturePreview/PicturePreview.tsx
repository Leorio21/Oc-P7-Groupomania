import { XIcon } from "@heroicons/react/outline";
import { MouseEventHandler } from "react";

import classNames from "classnames";
import cn from './PicturePreview.module.scss'

interface PicturePreviewProps {
    pictureUrl: string | null | undefined,
    resetPicture: MouseEventHandler
}

const PicturePreview = ({pictureUrl, resetPicture}: PicturePreviewProps) => {

    return (
        <>
            <div className={classNames(cn.preview_container)}>
                {pictureUrl &&
                    <>
                        <img src={pictureUrl} />
                        <div className={classNames(cn.deletePicture)}><XIcon className={classNames(cn.icon)} onClick={resetPicture} /></div>
                    </>
                }
            </div>
        </>
    )
}

export default PicturePreview;