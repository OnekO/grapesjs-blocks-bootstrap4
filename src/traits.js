export default (editor, config = {}) => {

    const tm = editor.TraitManager;

    // Select trait that maps a class list to the select options.
    // The default select option is set if the input has a class, and class list is modified when select value changes.
    tm.addType('class_select', {
        events: {
            'change': 'onChange' // trigger parent onChange method on input change
        },
        getInputEl: function() {
            if (!this.inputEl) {
                const md = this.model;
                const opts = md.get('options') || [];
                const input = document.createElement('select');
                const targetViewEl = this.target.view.el;
                for (let i = 0; i < opts.length; i++) {
                    const name = opts[i].name;
                    let value = opts[i].value;
                    if (value === '') {
                        value = 'GJS_NO_CLASS';
                    } // 'GJS_NO_CLASS' represents no class--empty string does not trigger value change
                    const option = document.createElement('option');
                    option.text = name;
                    option.value = value;
                    if (targetViewEl.classList.contains(value)) {
                        option.setAttribute('selected', 'selected');
                    }
                    input.append(option);
                }
                this.inputEl = input;
            }
            return this.inputEl;
        },

        onValueChange: function() {
            const classes = this.model.get('options').map(opt => opt.value);
            for (let i = 0; i < classes.length; i++) {
                if (classes[i].length > 0) {
                    const classI = classes[i].split(' ');
                    for (let j = 0; j < classI.length; j++) {
                        if (classI[j].length > 0) {
                            this.target.removeClass(classI[j]);
                        }
                    }
                }
            }
            let value = this.model.get('value');
            if (value && value.length > 0 && value !== 'GJS_NO_CLASS') {
                value = value.split(' ');
                for (let i = 0; i < value.length; i++) {
                    this.target.addClass(value[i]);
                }
            }
            this.target.em.trigger('change:selectedComponent');
        }
    });
};
