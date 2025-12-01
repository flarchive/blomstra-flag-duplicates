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

use Flarum\Flags\Event\Deleting;
use Flarum\Flags\Flag;
use FoF\MergeDiscussions\Events\DiscussionWasMerged;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Collection;

class RemoveDuplicateFlagAfterMerge
{
    /** @var Dispatcher */
    protected $events;

    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }

    public function handle(DiscussionWasMerged $event)
    {
        $discussion = $event->discussion;

        $mergedDiscussions = $event->mergedDiscussions;
        $mergedDiscussionIds = $mergedDiscussions->pluck('id')->toArray();

        /** @var array $postIds */
        $postIds = $discussion->posts->pluck('id');

        /** @var Collection $flags */
        $flags = Flag::where('reason', 'duplicate')->whereIn('post_id', $postIds)->whereIn('reason_detail', array_merge([$discussion->id], $mergedDiscussionIds))->get();

        foreach ($flags as $flag) {
            /** @var Flag $flag */
            $this->events->dispatch(new Deleting($flag, $event->actor, ['duplicateMerge' => true]));
            $flag->delete();
        }

        $discussion->refresh()->with('posts');
    }
}
