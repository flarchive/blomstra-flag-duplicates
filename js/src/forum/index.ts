import app from 'flarum/forum/app';
import DiscussionFlaggedDuplicatePost from './components/DiscussionFlaggedDuplicatePost';
import extendFlagModal from './extendFlagModal';
import Discussion from 'flarum/common/models/Discussion';
import Model from 'flarum/common/Model';

app.initializers.add('blomstra/flag-duplicates', () => {
  Discussion.prototype.canFlagDuplicate = Model.attribute<boolean>('canFlagDuplicate');

  app.postComponents.discussionFlaggedDuplicate = DiscussionFlaggedDuplicatePost;
  extendFlagModal();
});
