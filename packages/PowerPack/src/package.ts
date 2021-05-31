/* Do not change these import lines. Datagrok will import API library in exactly the same manner */
import * as grok from 'datagrok-api/grok';
import * as ui from 'datagrok-api/ui';
import * as DG from 'datagrok-api/dg';
import { welcomeView } from "./welcome-view";
import { compareColumns } from './compare-columns';
import { DistributionProfilerViewer } from './distribution-profiler';
import { SystemStatusWidget } from "./widgets/system-status-widget";
import { RecentProjectsWidget } from "./widgets/recent-projects-widget";
import { CommunityWidget } from './widgets/community-widget';
import { WebWidget } from './widgets/web-widget';
import { LearningWidget } from "./widgets/learning-widget";
import { functionSearch, pdbSearch, pubChemSearch, usersSearch, wikiSearch } from './search/entity-search';

export let _package = new DG.Package();

//name: compareColumns
//top-menu: Data | Compare Columns...
export function _compareColumns(): void {
  compareColumns();
}

//name: distributionProfiler
//tags: viewer
//output: viewer result
export function _distributionProfiler(): DistributionProfilerViewer {
  return new DistributionProfilerViewer();
}

//name: welcomeView
//tags: autostart
export function _welcomeView(): void {
  welcomeView();
}

//output: widget result
//tags: homepage
export function systemStatusWidget(): DG.Widget {
  return new SystemStatusWidget();
}

//output: widget result
//tags: homepage
export function recentProjectsWidget(): DG.Widget {
  return new RecentProjectsWidget();
}

//output: widget result
//tags: homepage
export function communityWidget(): DG.Widget {
  return new CommunityWidget();
}

//output: widget result
export function webWidget(): DG.Widget {
  return new WebWidget();
}

//output: widget result
export function learnWidget(): DG.Widget {
  return new LearningWidget();
}

//description: Functions
//tags: search
//input: string s
//output: list result
export function _functionSearch(s: string): Promise<any[]> {
  return functionSearch(s);
}

//description: Users
//tags: search
//input: string s
//output: list result
export function _usersSearch(s: string): Promise<any[]> {
  return usersSearch(s);
}

//description: Protein Data Bank
//tags: search
//input: string s
//output: widget
export function _pdbSearch(s: string): Promise<any> {
  return pdbSearch(s);
}

//description: PubChem
//tags: search
//input: string s
//output: widget
export function _pubChemSearch(s: string): Promise<any> {
  return pubChemSearch(s);
}

//description: PubChem
//tags: search
//input: string s
//output: widget
export function _wikiSearch(s: string): Promise<any> {
  return wikiSearch(s);
}
