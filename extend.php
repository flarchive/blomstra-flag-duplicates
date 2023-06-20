<?php

/*
 * This file is part of blomstra/flag-duplicates.
 *
 * Copyright (c) 2022 Blomstra Ltd.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Blomstra\FlagDuplicates;

use Blomstra\FlagDuplicates\Post\DiscussionFlaggedAsDuplicatePost;
use Flarum\Extend;
use Flarum\Flags\Event\Created as FlagCreated;
use Flarum\Flags\Event\Deleting as FlagDeleting;
use FoF\MergeDiscussions\Events\DiscussionWasMerged;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Event())
        ->listen(DiscussionWasMerged::class, Listener\RemoveDuplicateFlagAfterMerge::class)
        ->listen(FlagCreated::class, Listener\CreateDupeFlagRaisedPost::class)
        ->listen(FlagDeleting::class, Listener\DeleteDupeFlagRaisedPost::class),

    (new Extend\Post())
        ->type(DiscussionFlaggedAsDuplicatePost::class),
];
