# Flag Duplicates

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/blomstra/flag-duplicates.svg)](https://packagist.org/packages/blomstra/flag-duplicates) [![Total Downloads](https://img.shields.io/packagist/dt/blomstra/flag-duplicates.svg)](https://packagist.org/packages/blomstra/flag-duplicates)

A [Flarum](http://flarum.org) extension. Allow users to flag duplicate discussions

## Usage

This extension extends functionality of `flarum/flags` and `fof/merge-discussions`, to allow forum users to raise a notification to moderators about potential duplicate discussions.

Only the first post in a discussion can be marked as `Duplicate discussion`. The user is then presented with a search box to link the potential duplicate.

Moderators are then able to check, and merge directly from the flagged discussion if required.

## Installation

Install with composer:

```sh
composer require blomstra/flag-duplicates:"*"
```

## Updating

```sh
composer update blomstra/flag-duplicates
php flarum cache:clear
```

## Sponsored

The initial implementation of this extension was sponsored by [Kagi Search](https://kagi.com)

## Links

- [Packagist](https://packagist.org/packages/blomstra/flag-duplicates)
- [GitHub](https://github.com/blomstra/flarum-ext-flag-duplicate)
- [Discuss](https://discuss.flarum.org/d/PUT_DISCUSS_SLUG_HERE)
