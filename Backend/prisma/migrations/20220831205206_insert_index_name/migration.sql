-- RenameIndex
ALTER TABLE `comment` RENAME INDEX `Comment_authorId_fkey` TO `authorComment`;

-- RenameIndex
ALTER TABLE `comment` RENAME INDEX `Comment_postId_fkey` TO `PostCommente`;

-- RenameIndex
ALTER TABLE `post` RENAME INDEX `Post_authorId_fkey` TO `authorPost`;

-- RenameIndex
ALTER TABLE `postlike` RENAME INDEX `PostLike_postId_fkey` TO `postLike`;

-- RenameIndex
ALTER TABLE `postlike` RENAME INDEX `PostLike_userId_fkey` TO `userLike`;
