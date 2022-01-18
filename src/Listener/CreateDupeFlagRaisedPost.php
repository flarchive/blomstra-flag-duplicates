<?php

/*
 * This file is part of blomstra/flag-duplicates.
 *
 * Copyright (c) 2022 Blomstra Ltd.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Blomstra\FlagDuplicates\Listener;

use Blomstra\FlagDuplicates\Post\DiscussionFlaggedAsDuplicatePost;
use Flarum\Flags\Event\Created;
use Flarum\Settings\SettingsRepositoryInterface;

class CreateDupeFlagRaisedPost
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function handle(Created $event)
    {
        $flag = $event->flag;

        if ($flag->reason === 'duplicate' && (bool) $this->settings->get('blomstra-flag-duplicates.event_post', false)) {
            $discussion = $flag->post->discussion;

            $post = DiscussionFlaggedAsDuplicatePost::reply(
                $discussion->id,
                $event->actor->id,
                $flag->reason_detail
            );

            $discussion->mergePost($post);
        }
    }
}
