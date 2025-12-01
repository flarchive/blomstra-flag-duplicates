<?php

namespace Blomstra\FlagDuplicates\Api;

use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Flags\AddCanFlagAttribute;
use Flarum\Settings\SettingsRepositoryInterface;

class AddCanFlagDuplicateAttribute
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected PostSerializer $postSerializer,
        protected AddCanFlagAttribute $gate
    ) {}

    public function __invoke(DiscussionSerializer $serializer, Discussion $discussion): bool
    {
        $this->postSerializer->setRequest($serializer->getRequest());

        $gate = $this->gate;

        return $gate($this->postSerializer, $discussion->firstPost);
    }
}
