<?php

/*
 * This file is part of blomstra/flag-duplicates.
 *
 * Copyright (c) 2022 Blomstra Ltd.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Blomstra\FlagDuplicates\Post;

use Flarum\Post\AbstractEventPost;
use Flarum\Post\MergeableInterface;
use Flarum\Post\Post;

class DiscussionFlaggedAsDuplicatePost extends AbstractEventPost implements MergeableInterface
{
    /**
     * {@inheritdoc}
     */
    public static $type = 'discussionFlaggedDuplicate';

    /**
     * {@inheritdoc}
     */
    public function saveAfter(Post $previous = null)
    {
        $this->save();

        return $this;
    }

    /**
     * Create a new instance in reply to a discussion.
     *
     * @param int $discussionId
     * @param int $userId
     * @param int $duplicateDiscussionId
     *
     * @return static
     */
    public static function reply($discussionId, $userId, $duplicateDiscussionId)
    {
        $post = new static();

        $post->content = $duplicateDiscussionId;
        $post->created_at = time();
        $post->discussion_id = $discussionId;
        $post->user_id = $userId;

        return $post;
    }
}
