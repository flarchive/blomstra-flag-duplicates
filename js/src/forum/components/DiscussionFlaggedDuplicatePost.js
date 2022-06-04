import app from 'flarum/forum/app';
import EventPost from 'flarum/forum/components/EventPost';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Link from 'flarum/common/components/Link';

export default class DiscussionFlaggedDuplicatePost extends EventPost {
  oninit(vnode) {
    super.oninit(vnode);

    this.subtree.check(
      () => this.dupe?.freshness,
      () => this.dupeFail
    );
  }

  oncreate(vnode) {
    super.oncreate(vnode);

    this.loadDupe();
  }

  icon() {
    return 'fas fa-flag';
  }

  descriptionKey() {
    return 'blomstra-flag-duplicates.forum.post_stream.flagged_duplicate_text';
  }

  descriptionData() {
    const data = {};

    data.duplicate = this.dupe ? (
      <Link href={app.route.discussion(this.dupe)}>{this.dupe.title()}</Link>
    ) : this.dupeFail ? (
      <code>{app.translator.trans('blomstra-flag-duplicates.forum.post_stream.deleted_discussion')}</code>
    ) : (
      <LoadingIndicator size="small" display="inline" />
    );

    return data;
  }

  async loadDupe() {
    const dupeId = this.attrs.post.content();

    try {
      this.dupe = await app.store.find(
        'discussions',
        dupeId,
        {},
        {
          errorHandler: () => {
            this.dupeFail = true;
            m.redraw();
          },
        }
      );
    } catch {
      this.dupeFail = true;
    }

    m.redraw();
  }
}
