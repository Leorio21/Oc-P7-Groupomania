
interface CommentListProps {
    arrayComment: (Comment & {
        author: {
            firstName: string,
            lastName: string,
        },
    })[]
}

const CommentList = ({arrayComment}: CommentListProps) => {

    return (
        <>
        </>
    )
}

export default CommentList;