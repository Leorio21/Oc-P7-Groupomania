import React from "react";
import { ClipLoader } from "react-spinners";

interface LoaderProps {
    color: string
    isLoading: boolean
    size: number
}

const Loader = ({color, isLoading, size}: LoaderProps) => {
    return (
        <div>
            <ClipLoader
                color={color}
                loading={isLoading}
                size={size}
            />
        </div>
    );
};

export default Loader;