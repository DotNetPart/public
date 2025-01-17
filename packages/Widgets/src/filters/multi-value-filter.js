class MultiValueFilter extends DG.Filter {

  constructor() {
    super();
    this.valuesHost = ui.divV([]);
    //this.typeSelect = ui.choiceInput('Type', 'any', ['any', 'all']);
    this.root = ui.divV([this.valuesHost]);
    this.subs = [];
  }

  attach(dataFrame) {
    this.dataFrame = dataFrame;
    this.column = this.dataFrame.columns.byIndex(0);
    //this.column = DG.Utils.firstOrNull(this.dataFrame.columns.byTags({ 'multi-value-separator' : null }));

    this.subs.push(this.dataFrame.onRowsFiltering.subscribe((_) => this.applyFilter()));

    this.render();
  }

  detach() {
    console.log('detached!');
    this.subs.forEach((s) => s.unsubscribe());
  }

  applyFilter() {
    let separator = ' | ';
    let checkedValues = new Set();
    let checkedNodes = this.root.querySelectorAll("input[type='checkbox']:checked");
    for (let i = 0; i < checkedNodes.length; i++) {
      let check = checkedNodes[i];
      checkedValues.add(check.getAttribute('name'));
    }

    const filter = this.dataFrame.filter;
    const rowCount = this.dataFrame.rowCount;

    for (let i = 0; i < rowCount; i++) {
      let vv = this.column.get(i).split(separator);
      let contains = vv.some((v) => checkedValues.has(v));

      if (!contains)
        filter.set(i, false, false);
    }

    this.dataFrame.filter.fireChanged();
  }

  render() {
    let values = new Set();
    let separator = ' | ';  //;this.column.tags[DG.TAGS.MULTI_VALUE_SEPARATOR];

    for (let i = 0; i < this.column.length; i++) {
      let vv = this.column.get(i).split(separator);
      //let vv = s.map((s) => s.trim());
      for (let v of vv)
        if (v !== '')
          values.add(v)
    }

    $(this.valuesHost).empty();

    for (let v of values) {
      let id = `rb_${buttonId++}`;
      let check = $(`<input type="checkbox" id="${id}" name="${v}">`)
        .on('change', () => this.dataFrame.rows.requestFilter())
      let label = $(`<label for="${id}">${v}</label>`)
      this.valuesHost.appendChild(ui.div([check[0], label[0]]));
    }
  }
}
