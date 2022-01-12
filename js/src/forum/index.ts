import app from 'flarum/forum/app';
import extendFlagModal from './extendFlagModal';

app.initializers.add('blomstra/flag-duplicates', () => {
  extendFlagModal();
});
