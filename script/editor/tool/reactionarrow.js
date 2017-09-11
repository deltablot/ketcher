/****************************************************************************
 * Copyright 2017 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/

var Action = require('../action');

function ReactionArrowTool(editor) {
	if (!(this instanceof ReactionArrowTool))
		return new ReactionArrowTool(editor);

	this.editor = editor;
	this.editor.selection(null);
}

ReactionArrowTool.prototype.mousedown = function (event) {
	var rnd = this.editor.render;
	var ci = this.editor.findItem(event, ['rxnArrows']);
	if (ci && ci.map === 'rxnArrows') {
		this.editor.hover(null);
		this.editor.selection({ rxnArrows: [ci.id] });
		this.dragCtx = { xy0: rnd.page2obj(event) };
	}
};
ReactionArrowTool.prototype.mousemove = function (event) {
	var rnd = this.editor.render;
	if ('dragCtx' in this) {
		if (this.dragCtx.action)
			this.dragCtx.action.perform(rnd.ctab);

		this.dragCtx.action = Action.fromMultipleMove(
			rnd.ctab,
			this.editor.selection() || {},
			rnd.page2obj(event).sub(this.dragCtx.xy0)
		);
		this.editor.update(this.dragCtx.action, true);
	} else {
		this.editor.hover(this.editor.findItem(event, ['rxnArrows']));
	}
};
ReactionArrowTool.prototype.mouseup = function (event) {
	var rnd = this.editor.render;
	if (this.dragCtx) {
		this.editor.update(this.dragCtx.action); // TODO investigate, subsequent undo/redo fails
		delete this.dragCtx;
	} else if (rnd.ctab.molecule.rxnArrows.count() < 1) {
		this.editor.update(Action.fromArrowAddition(rnd.ctab, rnd.page2obj(event)));
	}
};

module.exports = ReactionArrowTool;
