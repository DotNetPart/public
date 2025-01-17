import * as grok from 'datagrok-api/grok';
import * as DG from "datagrok-api/dg";
import * as ui from "datagrok-api/ui";
import { study } from "../clinical-study";
import { validationRulesList } from "../package";
import { pinnacleRuleIdColumnName, validationResultRuleIdColumn } from "../validation/constants";
import { createRulesDataFrame } from '../validation/validation-utils';
import { getUniqueValues } from '../data-preparation/utils';

export class ValidationView extends DG.ViewBase {

  resultsDataframe: DG.DataFrame;
  rulesDataframe: DG.DataFrame;
  resultsGrid: DG.Grid;
  rulesGrid: DG.Grid;
  errorsByDomain: any;
  domains: any;

  constructor(errorsMap: any, name) {
    super(name);
    this.name = name;

    this.errorsByDomain = errorsMap;
    this.resultsDataframe = study.validationResults;
    this.domains = study.domains;

    let uniqueViolatedRuleIds = getUniqueValues(study.validationResults, validationResultRuleIdColumn);
    this.rulesDataframe = this.getViolatedRulesDataframe(validationRulesList, uniqueViolatedRuleIds);

    this.rulesGrid = this.rulesDataframe.plot.grid();

    grok.data.linkTables(this.rulesDataframe, this.resultsDataframe,
      [ `${pinnacleRuleIdColumnName}` ], [ `${validationResultRuleIdColumn}` ],
      [ DG.SYNC_TYPE.CURRENT_ROW_TO_SELECTION, DG.SYNC_TYPE.CURRENT_ROW_TO_SELECTION ]);


    this.generateUI();
  }

  private generateUI() {

    let viewerTitle = {style:{
      'color':'var(--grey-6)',
      'margin':'12px 0px 6px 12px',
      'font-size':'16px',
      'justify-content':'center'
    }};


    let violatedRules = DG.Viewer.grid(this.rulesDataframe);
    violatedRules.root.prepend();

    let tabs = ui.tabControl(this.createErrorsTabControl());
    console.log(tabs)

    this.root.className = 'grok-view ui-box';
    this.root.appendChild(
      ui.splitV([
        ui.box(ui.divText('Violated rules', viewerTitle), { style: { maxHeight: '45px' } }),
        violatedRules.root,
        ui.box(ui.divText('Errors', viewerTitle), { style: { maxHeight: '45px' } }),
        tabs.root
      ])
    );

  }

  private createErrorsTabControl() {
    const tabControl = {}
    Object.keys(this.errorsByDomain).forEach(key => {
      const domainDataframe = this.domains[ key ];
      this.addRowNumberColumn(domainDataframe, key);
      tabControl[`${key.toUpperCase()} (${this.errorsByDomain[ key ]})`] = DG.Viewer.grid(domainDataframe).root;
      grok.data.linkTables(this.resultsDataframe, domainDataframe,
        [ `Row number`,  'Domain'], [ `Row number`,  'Domain lower case' ],
        [ DG.SYNC_TYPE.SELECTION_TO_SELECTION, DG.SYNC_TYPE.SELECTION_TO_FILTER ]);
    })
    return tabControl;
  }


  private addRowNumberColumn(dataframe: DG.DataFrame, domain: string){
    if(!dataframe.columns.contains('Row number')){
      dataframe.columns.addNewInt('Row number').init((i) => i+1);
    }
    if(!dataframe.columns.contains('Domain lower case')){
      dataframe.columns.addNewString('Domain lower case').init((i) => domain);
    }
  }

  
  private getViolatedRulesDataframe(rules: DG.DataFrame, uniqueViolatedRuleIds: any) {
    const res = createRulesDataFrame();
    let column = rules.columns.byName(pinnacleRuleIdColumnName);
    let rowCount = rules.rowCount;
    for (let i = 0; i < rowCount; i++) {
      if (uniqueViolatedRuleIds.has(column.get(i))) {
        const array = [];
        for (let col of rules.columns)
          array.push(col.get(i));
        res.rows.addNew(array);
      }
    }
    return res;
  }

}

