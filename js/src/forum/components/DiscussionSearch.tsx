import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import { components } from '@fof-merge-discussions';
import Button from 'flarum/common/components/Button';
import withAttr from 'flarum/common/utils/withAttr';
import Discussion from 'flarum/common/models/Discussion';
import Stream from 'flarum/common/utils/Stream';
import GlobalSearchState from 'flarum/forum/states/GlobalSearchState';
import type Mithril from 'mithril';

interface IAttrs {
  discussion: Discussion;
  reason: Stream<string>;
  reasonDetail: Stream<string | number>;
}

interface IState {
  selectedDiscussion: Discussion | null;
}

export default class DiscussionSearch extends Component<IAttrs, IState> {
  search!: GlobalSearchState;

  oninit(vnode: Mithril.Vnode<IAttrs, this>): void {
    super.oninit(vnode);

    this.state = {
      selectedDiscussion: null,
    };
  }

  oncreate(vnode: Mithril.VnodeDOM<IAttrs, this>): void {
    super.oncreate(vnode);
  }

  view(): Mithril.Children {
    const discussion = this.attrs.discussion;
    this.search = new GlobalSearchState();


    return (
      <label className="checkbox">
        <input
          type="radio"
          name="reason"
          checked={this.attrs.reason() === 'duplicate'}
          value="duplicate"
          onclick={withAttr('value', this.attrs.reason)}
        />
        <strong>{app.translator.trans('blomstra-flag-duplicates.forum.flags.reason_duplicate_label')}</strong>
        {app.translator.trans('blomstra-flag-duplicates.forum.flags.reason_duplicate_text')}

        {this.attrs.reason() === 'duplicate' && (
          <div class="FlagPostModal-DuplicateSearch" data-result-selected={!!this.state.selectedDiscussion}>
            <components.DiscussionSearch
              state={this.search}
              onSelect={((discussion: Discussion) => {
                if (! discussion) {
                  return;
                }

                this.state.selectedDiscussion = discussion;
                this.attrs.reasonDetail(discussion.id());
                m.redraw();
              }).bind(this)}
              ignore={discussion ? discussion.id() : null}
            />

            <div class="FlagPostModal-SelectedDuplicate">
              <Button
                class="Button Button--icon"
                icon="fas fa-trash"
                aria-label={app.translator.trans('blomstra-flag-duplicates.forum.flags.deselect_discussion_a11y_label')}
                onclick={() => {
                  this.state.selectedDiscussion = null;
                  this.attrs.reasonDetail('');
                }}
              />
              <span>
                {this.state.selectedDiscussion?.id()} ~ {this.state.selectedDiscussion?.title()}
              </span>
            </div>
          </div>
        )}
      </label>
    );
  }
}
