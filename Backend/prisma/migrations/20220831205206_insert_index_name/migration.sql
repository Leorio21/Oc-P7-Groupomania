-- RenameIndex
ALTER TABLE `Comment` RENAME INDEX `Comment_authorId_fkey` TO `authorComment`;

-- RenameIndex
ALTER TABLE `Comment` RENAME INDEX `Comment_postId_fkey` TO `PostCommente`;

-- RenameIndex
ALTER TABLE `Post` RENAME INDEX `Post_authorId_fkey` TO `authorPost`;

-- RenameIndex
ALTER TABLE `PostLike` RENAME INDEX `PostLike_postId_fkey` TO `postLike`;

-- RenameIndex
ALTER TABLE `PostLike` RENAME INDEX `PostLike_userId_fkey` TO `userLike`;
