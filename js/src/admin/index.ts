import app from 'flarum/admin/app';

app.initializers.add('blomstra/flag-duplicates', () => {
  app.extensionData.for('blomstra-flag-duplicates').registerSetting({
    setting: 'blomstra-flag-duplicates.event_post',
    type: 'boolean',
    label: app.translator.trans('blomstra-flag-duplicates.admin.settings.event_post_label'),
    help: app.translator.trans('blomstra-flag-duplicates.admin.settings.event_post_help'),
  });
});
