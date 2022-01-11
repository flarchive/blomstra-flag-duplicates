import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import FlagPostModal from 'flarum/flags/forum/components/FlagPostModal';
import { findFirstVdomChild } from './utils/findVdomChild';
import withAttr from 'flarum/common/utils/withAttr';
import Post from 'flarum/forum/components/Post';
import Link from 'flarum/common/components/Link';
import type Mithril from 'mithril';
import icon from 'flarum/common/helpers/icon';
import { components } from '@fof-merge-discussions';
import GlobalSearchState from 'flarum/forum/states/GlobalSearchState';
import Discussion from 'flarum/common/models/Discussion';
import Flag from 'flarum/flags/forum/models/flag';
import ItemList from 'flarum/common/utils/ItemList';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';

export default function extendFlagModal() {
  // https://github.com/flarum/flags/pull/39 is not available
  if (!FlagPostModal.prototype.flagReasons) {
    extend(FlagPostModal.prototype, 'content', function (vnode: Mithril.Vnode) {
      if (this.attrs.post?.number() === 1) {
        findFirstVdomChild(vnode, '.Form-group', (vnode) => {
          const discussion = this.attrs.post.discussion();
          this.search = new GlobalSearchState();

          vnode.children[0].children.splice(
            0,
            0,
            <label className="checkbox">
              <input type="radio" name="reason" checked={this.reason() === 'duplicate'} value="duplicate" onclick={withAttr('value', this.reason)} />
              <strong>{app.translator.trans('blomstra-flag-duplicates.forum.flags.reason_duplicate_label')}</strong>
              {app.translator.trans('blomstra-flag-duplicates.forum.flags.reason_duplicate_text')}
              {this.reason() === 'duplicate' ? (
                <components.DiscussionSearch
                  state={this.search}
                  onSelect={((discussion: Discussion) => {
                    this.reasonDetail = Stream(discussion.id());
                  }).bind(this)}
                  ignore={discussion.id()}
                />
              ) : (
                ''
              )}
            </label>
          );
        });
      }
    });
  }

  // Requires https://github.com/flarum/flags/pull/39
  extend(FlagPostModal.prototype, 'flagReasons', function (items: ItemList) {
    if (this.attrs.post?.number() === 1) {
      const discussion = this.attrs.post.discussion();
      this.search = new GlobalSearchState();

      items.add(
        'duplicate',
        <label className="checkbox">
          <input type="radio" name="reason" checked={this.reason() === 'duplicate'} value="duplicate" onclick={withAttr('value', this.reason)} />
          <strong>{app.translator.trans('blomstra-flag-duplicates.forum.flags.reason_duplicate_label')}</strong>
          {app.translator.trans('blomstra-flag-duplicates.forum.flags.reason_duplicate_text')}
          {this.reason() === 'duplicate' ? (
            <components.DiscussionSearch
              state={this.search}
              onSelect={((discussion: Discussion) => {
                this.reasonDetail = Stream(discussion.id());
              }).bind(this)}
              ignore={discussion.id()}
            />
          ) : (
            ''
          )}
        </label>,
        100
      );
    }
  });

  extend(Post.prototype, 'flagActionItems', function (items: ItemList) {
    const flags = this.attrs.post?.flags?.();

    // If (at least) one of the flags here is `duplicate`, then we'll remove the `Delete` button and replace it with a `Merge` button.
    flags.map((flag: Flag) => {
      if (flag?.reason?.() === 'duplicate') {
        const discussion = this.attrs.post.discussion();

        items.remove('controls');
        items.add(
          'merge',
          <Button
            className="Button"
            icon="fas fa-code-branch fa-flip-vertical"
            disabled={!!!this.dupeDiscussion}
            onclick={() => {
              app.modal.show(components.DiscussionMergeModal, { discussion, preselect: this.dupeDiscussion });
            }}
          >
            {app.translator.trans('fof-merge-discussions.forum.discussion.merge')}
          </Button>,
          5
        );
      }
    });
  });

  override(Post.prototype, 'flagReason', function (original, flag: Flag) {
    const orig = original(flag);

    if (flag?.reason?.() === 'duplicate') {
      if (this.flagsLoading || !this.dupeDiscussion) {
        orig[1] = (
          <span className="Post-flagged-detail">
            <LoadingIndicator size="small" display="inline" />
          </span>
        );

        return orig;
      }

      const url = app.route.discussion(this.dupeDiscussion);

      orig[1] = (
        <span className="Post-flagged-detail">
          <Link href={url} external={true} target="_blank">
            {this.dupeDiscussion.title() || app.translator.trans('blomstra-flag-duplicates.forum.flags.duplicate_discussion')}{' '}
            {icon('fas fa-external-link-alt')}{' '}
          </Link>
        </span>
      );
      return orig;
    } else {
      return orig;
    }
  });

  extend(Post.prototype, 'oninit', function (this: Post, vnode: Mithril.Vnode) {
    const flags = this.attrs.post?.flags?.();

    if (flags) {
      this.flagsLoading = true;
      flags.map((flag: Flag) => {
        if (flag?.reason?.() === 'duplicate') {
          app.store.find('discussions', flag.reasonDetail()).then((discussion: Discussion) => {
            this.dupeDiscussion = discussion;
          });
        }
      });
      this.flagsLoading = false;
    }
  });

  extend(DiscussionControls, 'userControls', function (items: ItemList, discussion: Discussion) {
    const post = discussion.firstPost();
    if (!post || post.isHidden() || post.contentType() !== 'comment' || !post.canFlag()) return;

    items.add(
      'flag-dupe',
      <Button icon="fas fa-flag" onclick={() => app.modal.show(FlagPostModal, { post })}>
        {app.translator.trans('flarum-flags.forum.post_controls.flag_button')}
      </Button>,
      0
    );
  });
}
