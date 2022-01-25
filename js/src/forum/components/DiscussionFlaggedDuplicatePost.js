import app from 'flarum/forum/app';
import EventPost from 'flarum/components/EventPost';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Link from 'flarum/common/components/Link';

export default class DiscussionFlaggedDuplicatePost extends EventPost {
  oninit(vnode) {
    super.oninit(vnode);

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
    ) : (
      <LoadingIndicator size="small" display="inline" />
    );

    return data;
  }

  loadDupe() {
    const dupeId = this.attrs.post.content();
    app.store.find('discussions', dupeId).then((discussion) => {
      this.dupe = discussion;

      m.redraw();
    });
  }
}
