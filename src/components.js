import _ from 'underscore';
import _s from 'underscore.string';
import loadCollapse from './components/collapse';
import loadDropdown from './components/dropdown';

export default (editor, config = {}) => {

    const img_src_default = 'https://dummyimage.com/450x250/999/222';

    const contexts = [
        'primary', 'secondary',
        'success', 'info',
        'warning', 'danger',
        'light', 'dark'
    ];

    const contexts_w_white = contexts.concat(['white']);

    const sizes = {
        'lg': config.sizes.large,
        'sm': config.sizes.small
    };

    const c = config;
    let domc = editor.DomComponents;
    let blocks = c.blocks;
    let cats = c.blockCategories;

    var defaultType = domc.getType('default');
    var defaultModel = defaultType.model;
    var defaultView = defaultType.view;

    var textType = domc.getType('text');
    var textModel = textType.model;
    var textView = textType.view;

    var linkType = domc.getType('link');
    var linkModel = linkType.model;
    var linkView = linkType.view;

    var imageType = domc.getType('image');
    var imageModel = imageType.model;
    var imageView = imageType.view;

    const idTrait = {
        name: 'id',
        label: c.labels.trait_id,
    };

    const forTrait = {
        name: 'for',
        label: c.labels.trait_for,
    };

    const nameTrait = {
        name: 'name',
        label: c.labels.trait_name,
    };

    const placeholderTrait = {
        name: 'placeholder',
        label: c.labels.trait_placeholder,
    };

    const valueTrait = {
        name: 'value',
        label: c.labels.trait_value,
    };

    const requiredTrait = {
        type: 'checkbox',
        name: 'required',
        label: c.labels.trait_required,
    };

    const checkedTrait = {
        label: c.labels.trait_checked,
        type: 'checkbox',
        name: 'checked',
        changeProp: 1
    };

    const preventDefaultClick = () => {
        return defaultType.view.extend({
            events: {
                'mousedown': 'handleClick',
            },

            handleClick(e) {
                e.preventDefault();
            },
        });
    };

    // Rebuild the default component and add utility settings to it (border, bg, color, etc)
    if (cats.basic) {
        if (blocks.default) {
            domc.addType('default', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        tagName: 'div',
                        traits: [
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.default},
                                    ... contexts_w_white.map(function(v) { return {value: 'text-'+v, name: _s.capitalize(v)} })
                                ],
                                label: config.labels.textColor
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: 'Default'},
                                    ... contexts_w_white.map(function(v) { return {value: 'bg-'+v, name: _s.capitalize(v)} })
                                ],
                                label: config.labels.backgroundColor
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: 'Default'},
                                    {value: 'border', name: 'Full'},
                                    {value: 'border-top-0', name: 'No top'},
                                    {value: 'border-right-0', name: 'No right'},
                                    {value: 'border-bottom-0', name: 'No bottom'},
                                    {value: 'border-left-0', name: 'No left'},
                                    {value: 'border-0', name: config.text.none}
                                ],
                                label: config.labels.borderWidth
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: 'Default'},
                                    ... contexts_w_white.map(function(v) { return {value: 'border border-'+v, name: _s.capitalize(v)} })
                                ],
                                label: config.labels.borderColor
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: 'Default'},
                                    {value: 'rounded', name: 'Rounded'},
                                    {value: 'rounded-top', name: 'Rounded top'},
                                    {value: 'rounded-right', name: 'Rounded right'},
                                    {value: 'rounded-bottom', name: 'Rounded bottom'},
                                    {value: 'rounded-left', name: 'Rounded left'},
                                    {value: 'rounded-circle', name: 'Circle'},
                                    {value: 'rounded-0', name: 'Square'},
                                ],
                                label: config.labels.borderRadius
                            },
                            {
                                type: 'text',
                                label: 'ID',
                                name: 'id',
                                placeholder: 'my_element'
                            },
                            {
                                type: 'text',
                                label: 'Title',
                                name: 'title',
                                placeholder: 'My Element'
                            }
                        ] //.concat(defaultModel.prototype.defaults.traits)
                    }),
                    init() {
                        const classes = this.get('classes');
                        classes.bind('add', this.classesChanged.bind(this));
                        classes.bind('change', this.classesChanged.bind(this));
                        classes.bind('remove', this.classesChanged.bind(this));
                        this.init2();
                    },
                    /* BS comps use init2, not init */
                    init2() {},
                    /* method where we can check if we should changeType */
                    classesChanged() {},
                    /* replace the comp with a copy of a different type */
                    changeType(new_type) {
                        const coll = this.collection;
                        const at = coll.indexOf(this);
                        const button_opts = {
                            type: new_type,
                            style: this.getStyle(),
                            attributes: this.getAttributes(),
                            content: this.view.el.innerHTML
                        }
                        coll.remove(this);
                        coll.add(button_opts, { at });
                        this.destroy();
                    }
                }),
                view: defaultView
            });
            defaultType = domc.getType('default');
            defaultModel = defaultType.model;
            defaultView = defaultType.view;
        }

        // Rebuild the text component and add display utility setting
        if (blocks.text) {
            domc.addType('text', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.text,
                        tagName: 'div',
                        droppable: true,
                        editable: true
                    })
                }, {
                    /*isComponent(el) {
                      if(el && el.dataset && el.dataset.bsText) {
                        return {type: 'text'};
                      }
                    }*/
                }),
                view: textView
            });
            textType = domc.getType('text');
            textModel = textType.model;
            textView = textType.view;
        }

        // Rebuild the link component with settings for collapse-control
        if (blocks.link) {
            domc.addType('link', {
                model: textModel.extend({
                    defaults: Object.assign({}, textModel.prototype.defaults, {
                        'custom-name': config.text.link,
                        tagName: 'a',
                        droppable: true,
                        editable: true,
                        traits: [
                            {
                                type: 'text',
                                label: 'Href',
                                name: 'href',
                                placeholder: 'https://www.grapesjs.com'
                            },
                            {
                                type: 'select',
                                options: [
                                    {value: '', name: 'This window'},
                                    {value: '_blank', name: 'New window'}
                                ],
                                label: config.labels.target,
                                name: 'target',
                            },
                            {
                                type: 'select',
                                options: [
                                    {value: '', name: config.text.none},
                                    {value: 'button', name: 'Self'},
                                    {value: 'collapse', name: 'Collapse'},
                                    {value: 'dropdown', name: 'Dropdown'}
                                ],
                                label: config.labels.toggles,
                                name: 'data-toggle',
                                changeProp: 1
                            }
                        ].concat(textModel.prototype.defaults.traits)
                    }),
                    init2() {
                        //textModel.prototype.init.call(this);
                        this.listenTo(this, 'change:data-toggle', this.setupToggle);
                        this.listenTo(this, 'change:attributes', this.setupToggle); // for when href changes
                    },
                    setupToggle(a, b, options = {}) { // this should be in the dropdown comp and not the link comp
                        if(options.ignore === true && options.force !== true) {
                            return;
                        }
                        console.log('setup toggle');
                        const attrs = this.getAttributes();
                        const href = attrs.href;
                        // old attributes are not removed from DOM even if deleted...
                        delete attrs['data-toggle'];
                        delete attrs['aria-expanded'];
                        delete attrs['aria-controls'];
                        delete attrs['aria-haspopup'];
                        if(href && href.length > 0 && href.match(/^#/)) {
                            console.log('link has href');
                            // find the el where id == link href
                            const els = this.em.get('Editor').DomComponents.getWrapper().find(href);
                            if(els.length > 0) {
                                console.log('referenced el found');
                                var el = els[0]; // should only be one el with this ID
                                const el_attrs = el.getAttributes();
                                //delete el_attrs['aria-labelledby'];
                                const el_classes = el_attrs.class;
                                if(el_classes) {
                                    console.log('el has classes');
                                    const el_classes_list = el_classes.split(' ');
                                    const intersection = _.intersection(['collapse','dropdown-menu'], el_classes_list);
                                    if(intersection.length) {
                                        console.log('link data-toggle matches el class');
                                        switch(intersection[0]) {
                                            case 'collapse':
                                                attrs['data-toggle'] = 'collapse';
                                                break;
                                        }
                                        attrs['aria-expanded'] = el_classes_list.includes('show');
                                        if(intersection[0] == 'collapse') {
                                            attrs['aria-controls'] = href.substring(1);
                                        }
                                    }
                                }
                            }
                        }
                        this.set('attributes', attrs, {ignore: true});
                    },
                    classesChanged(e) {
                        console.log('classes changed');
                        if(this.attributes.type == 'link') {
                            if (this.attributes.classes.filter(function(klass) { return klass.id=='btn' }).length > 0) {
                                this.changeType('button');
                            }
                        }
                    }
                }, {
                    isComponent(el) {
                        if(el && el.tagName && el.tagName == 'A') {
                            return {type: 'link'};
                        }
                    }
                }),
                view: linkView
            });
            linkType = domc.getType('link');
            linkModel = linkType.model;
            linkView = linkType.view;
        }

        if (blocks.image) {
            domc.addType('image', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.labels.image,
                        tagName: 'img',
                        resizable: 1,
                        attributes: {
                            src: img_src_default
                        },
                        traits: [
                            {
                                type: 'text',
                                label: config.labels.sourceURL,
                                name: 'src'
                            },
                            {
                                type: 'text',
                                label: config.labels.alternateText,
                                name: 'alt'
                            }
                        ].concat(defaultModel.prototype.defaults.traits)
                    })
                }, {
                    isComponent: function(el) {
                        if(el && el.tagName == 'IMG') {
                            return {type: 'image'};
                        }
                    }
                }),
                view: defaultView
            });
            imageType = domc.getType('image');
            imageModel = imageType.model;
            imageView = imageType.view;
        }


        // Basic

        /*if (blocks.list) {
          domc.addType('list', {
            model: defaultModel.extend({
              defaults: Object.assign({}, defaultModel.prototype.defaults, {
                'custom-name': 'List',
                tagName: 'ul',
                resizable: 1,
                traits: [
                  {
                    type: 'select',
                    options: [
                      {value: 'ul', name: 'No'},
                      {value: 'ol', name: 'Yes'}
                    ],
                    label: 'Ordered?',
                    name: 'tagName',
                    changeProp: 1
                  }
                ].concat(defaultModel.prototype.defaults.traits)
              })
            }, {
              isComponent: function(el) {
                if(el && ['UL','OL'].includes(el.tagName)) {
                  return {type: 'list'};
                }
              }
            }),
            view: defaultView
          });
        }*/

        /*if (blocks.description_list) {
        }*/

    }

    // LAYOUT

    if (cats.layout) {

        // Container

        if (blocks.container) {
            domc.addType('container', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.container,
                        tagName: 'div',
                        droppable: true,
                        traits: [
                            {
                                type: 'class_select',
                                options: [
                                    {value: 'container', name: config.text.fixed},
                                    {value: 'container-fluid', name: config.text.fluid}
                                ],
                                label: config.labels.width
                            }
                        ].concat(defaultModel.prototype.defaults.traits)
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && (el.classList.contains('container') || el.classList.contains('container-fluid'))) {
                            return {type: 'container'};
                        }
                    }
                }),
                view: defaultView
            });
        }

        // Row

        if (blocks.row) {
            domc.addType('row', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.row,
                        tagName: 'div',
                        draggable: '.container, .container-fluid',
                        droppable: true,
                        traits: [
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.yes},
                                    {value: 'no-gutters', name: config.text.no}
                                ],
                                label: config.labels.gutters + '?'
                            }
                        ].concat(defaultModel.prototype.defaults.traits)
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('row')) {
                            return {type: 'row'};
                        }
                    }
                }),
                view: defaultView
            });
        }

        // Column & Column Break

        if (blocks.column) {
            domc.addType('column', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.column,
                        draggable: '.row',
                        droppable: true,
                        traits: [
                            {
                                type: 'class_select',
                                options: [
                                    {value: 'col', name: config.text.equal},
                                    {value: 'col-auto', name: config.text.variable},
                                    ... [1,2,3,4,5,6,7,8,9,10,11,12].map(function(i) { return {value: 'col-'+i, name: i+'/12'} })
                                ],
                                label: config.labels.xsWidth,
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    {value: 'col-sm', name: config.text.equal},
                                    {value: 'col-sm-auto', name: config.text.variable},
                                    ... [1,2,3,4,5,6,7,8,9,10,11,12].map(function(i) { return {value: 'col-sm-'+i, name: i+'/12'} })
                                ],
                                label: config.labels.smWidth,
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    {value: 'col-md', name: config.text.equal},
                                    {value: 'col-md-auto', name: config.text.variable},
                                    ... [1,2,3,4,5,6,7,8,9,10,11,12].map(function(i) { return {value: 'col-md-'+i, name: i+'/12'} })
                                ],
                                label: config.labels.mdWidth,
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    {value: 'col-lg', name: config.text.equal},
                                    {value: 'col-lg-auto', name: config.text.variable},
                                    ... [1,2,3,4,5,6,7,8,9,10,11,12].map(function(i) { return {value: 'col-lg-'+i, name: i+'/12'} })
                                ],
                                label: config.labels.lgWidth,
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    {value: 'col-xl', name: config.text.equal},
                                    {value: 'col-xl-auto', name: config.text.variable},
                                    ... [1,2,3,4,5,6,7,8,9,10,11,12].map(function(i) { return {value: 'col-xl-'+i, name: i+'/12'} })
                                ],
                                label: config.labels.xlWidth,
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    ... [0,1,2,3,4,5,6,7,8,9,10,11,12].map(function(i) { return {value: 'offset-'+i, name: i+'/12'} })
                                ],
                                label: config.labels.xsOffset,
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    ... [0,1,2,3,4,5,6,7,8,9,10,11,12].map(function(i) { return {value: 'offset-sm-'+i, name: i+'/12'} })
                                ],
                                label: config.labels.smOffset,
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    ... [0,1,2,3,4,5,6,7,8,9,10,11,12].map(function(i) { return {value: 'offset-md-'+i, name: i+'/12'} })
                                ],
                                label: config.labels.mdOffset,
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    ... [0,1,2,3,4,5,6,7,8,9,10,11,12].map(function(i) { return {value: 'offset-lg-'+i, name: i+'/12'} })
                                ],
                                label: config.labels.lgOffset,
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    ... [0,1,2,3,4,5,6,7,8,9,10,11,12].map(function(i) { return {value: 'offset-xl-'+i, name: i+'/12'} })
                                ],
                                label: config.labels.xlOffset,
                            },
                        ].concat(defaultModel.prototype.defaults.traits)
                    }),
                }, {
                    isComponent(el) {
                        let match = false;
                        if(el && el.classList) {
                            el.classList.forEach(function(klass) {
                                if(klass=="col" || klass.match(/^col-/)) {
                                    match = true;
                                }
                            });
                        }
                        if(match) return {type: 'column'};
                    }
                }),
                view: defaultView
            });

            domc.addType('column_break', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.columnBreak,
                        tagName: 'div',
                        classes: ['w-100']
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('w-100')) { // also check if parent is `.row`
                            return {type: 'column_break'};
                        }
                    }
                }),
                view: defaultView
            });

            // Media object

            domc.addType('media_object', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.mediaObject,
                        tagName: 'div',
                        classes: ['media']
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('media')) {
                            return {type: 'media'};
                        }
                    }
                }),
                view: defaultView
            });

            domc.addType('media_body', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.mediaBody,
                        tagName: 'div',
                        classes: ['media-body']
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('media-body')) {
                            return {type: 'media_body'};
                        }
                    }
                }),
                view: defaultView
            });

        }

    }

    // Bootstrap COMPONENTS

    if (cats.components) {

        // Alert

        if (blocks.alert) {
            domc.addType('alert', {
                model: textModel.extend({
                    defaults: Object.assign({}, textModel.prototype.defaults, {
                        'custom-name': config.text.alert,
                        tagName: 'div',
                        classes: ['alert'],
                        traits: [
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    ... contexts.map(function(v) { return {value: 'alert-'+v, name: _s.capitalize(v)} })
                                ],
                                label: config.labels.context
                            }
                        ].concat(textModel.prototype.defaults.traits)
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('alert')) {
                            return {type: 'alert'};
                        }
                    }
                }),
                view: textView
            });
        }

        // Badge

        if (blocks.badge) {
            domc.addType('badge', {
                model: textModel.extend({
                    defaults: Object.assign({}, textModel.prototype.defaults, {
                        'custom-name': config.text.badge,
                        tagName: 'span',
                        classes: ['badge'],
                        traits: [
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    ... contexts.map(function(v) { return {value: 'badge-'+v, name: _s.capitalize(v)} })
                                ],
                                label: config.labels.context
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: 'Default'},
                                    {value: 'badge-pill', name: 'Pill'},
                                ],
                                label: config.labels.shape
                            }
                        ].concat(textModel.prototype.defaults.traits)
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('badge')) {
                            return {type: 'badge'};
                        }
                    }
                }),
                view: textView
            });
        }



        // Card

        if (blocks.card) {
            domc.addType('card', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.card,
                        classes: ['card'],
                        traits: [
                            {
                                type: 'checkbox',
                                label: config.labels.imageTop,
                                name: 'card-img-top',
                                changeProp: 1
                            },
                            {
                                type: 'checkbox',
                                label: config.labels.header,
                                name: 'card-header',
                                changeProp: 1
                            },
                            {
                                type: 'checkbox',
                                label: config.labels.image,
                                name: 'card-img',
                                changeProp: 1
                            },
                            {
                                type: 'checkbox',
                                label: config.labels.imageOverlay,
                                name: 'card-img-overlay',
                                changeProp: 1
                            },
                            {
                                type: 'checkbox',
                                label: config.labels.body,
                                name: 'card-body',
                                changeProp: 1
                            },
                            {
                                type: 'checkbox',
                                label: config.labels.footer,
                                name: 'card-footer',
                                changeProp: 1
                            },
                            {
                                type: 'checkbox',
                                label: config.labels.imageBottom,
                                name: 'card-img-bottom',
                                changeProp: 1
                            }
                        ].concat(defaultModel.prototype.defaults.traits)
                    }),
                    init2() {
                        this.listenTo(this, 'change:card-img-top', this.cardImageTop);
                        this.listenTo(this, 'change:card-header', this.cardHeader);
                        this.listenTo(this, 'change:card-img', this.cardImage);
                        this.listenTo(this, 'change:card-img-overlay', this.cardImageOverlay);
                        this.listenTo(this, 'change:card-body', this.cardBody);
                        this.listenTo(this, 'change:card-footer', this.cardFooter);
                        this.listenTo(this, 'change:card-img-bottom', this.cardImageBottom);
                        this.components().comparator = 'card-order';
                        this.set('card-img-top', true);
                        this.set('card-body', true);
                    },
                    cardImageTop() { this.createCardComponent('card-img-top'); },
                    cardHeader() { this.createCardComponent('card-header'); },
                    cardImage() { this.createCardComponent('card-img'); },
                    cardImageOverlay() { this.createCardComponent('card-img-overlay'); },
                    cardBody() { this.createCardComponent('card-body'); },
                    cardFooter() { this.createCardComponent('card-footer'); },
                    cardImageBottom() { this.createCardComponent('card-img-bottom'); },
                    createCardComponent(prop) {
                        const state = this.get(prop);
                        const type = prop.replace(/-/g,'_').replace(/img/g,'image')
                        let children = this.components();
                        let existing = children.filter(function(comp) {
                            return comp.attributes.type == type;
                        })[0]; // should only be one of each.

                        if(state && !existing) {
                            var comp = children.add({
                                type: type
                            });
                            let comp_children = comp.components();
                            if(prop=='card-header') {
                                comp_children.add({
                                    type: 'header',
                                    tagName: 'h4',
                                    style: { 'margin-bottom': '0px' },
                                    content: 'Card Header'
                                });
                            }
                            if(prop=='card-img-overlay') {
                                comp_children.add({
                                    type: 'header',
                                    tagName: 'h4',
                                    classes: ['card-title'],
                                    content: 'Card title'
                                });
                                comp_children.add({
                                    type: 'text',
                                    tagName: 'p',
                                    classes: ['card-text'],
                                    content: "Some quick example text to build on the card title and make up the bulk of the card's content."
                                });
                            }
                            if(prop=='card-body') {
                                comp_children.add({
                                    type: 'header',
                                    tagName: 'h4',
                                    classes: ['card-title'],
                                    content: 'Card title'
                                });
                                comp_children.add({
                                    type: 'header',
                                    tagName: 'h6',
                                    classes: ['card-subtitle', 'text-muted', 'mb-2'],
                                    content: 'Card subtitle'
                                });
                                comp_children.add({
                                    type: 'text',
                                    tagName: 'p',
                                    classes: ['card-text'],
                                    content: "Some quick example text to build on the card title and make up the bulk of the card's content."
                                });
                                comp_children.add({
                                    type: 'link',
                                    classes: ['card-link'],
                                    href: '#',
                                    content: 'Card link'
                                });
                                comp_children.add({
                                    type: 'link',
                                    classes: ['card-link'],
                                    href: '#',
                                    content: 'Another link'
                                });
                            }
                            this.order();
                        } else if (!state) {
                            existing.destroy();
                        }
                    },
                    order() {

                    }
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('card')) {
                            return {type: 'card'};
                        }
                    }
                }),
                view: defaultView
            });

            domc.addType('card_image_top', {
                model: imageModel.extend({
                    defaults: Object.assign({}, imageModel.prototype.defaults, {
                        'custom-name': config.text.cardImageTop,
                        classes: ['card-img-top'],
                        'card-order': 1
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('card-img-top')) {
                            return {type: 'card_image_top'};
                        }
                    }
                }),
                view: imageView
            });

            domc.addType('card_header', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.cardHeader,
                        classes: ['card-header'],
                        'card-order': 2
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('card-header')) {
                            return {type: 'card_header'};
                        }
                    }
                }),
                view: defaultView
            });

            domc.addType('card_image', {
                model: imageModel.extend({
                    defaults: Object.assign({}, imageModel.prototype.defaults, {
                        'custom-name': config.text.cardImage,
                        classes: ['card-img'],
                        'card-order': 3
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('card-img')) {
                            return {type: 'card_image'};
                        }
                    }
                }),
                view: imageView
            });

            domc.addType('card_image_overlay', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.cardImageOverlay,
                        classes: ['card-img-overlay'],
                        'card-order': 4
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('card-img-overlay')) {
                            return {type: 'card_image_overlay'};
                        }
                    }
                }),
                view: defaultView
            });

            domc.addType('card_body', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.cardBody,
                        classes: ['card-body'],
                        'card-order': 5
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('card-body')) {
                            return {type: 'card_body'};
                        }
                    }
                }),
                view: defaultView
            });

            domc.addType('card_footer', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.cardFooter,
                        classes: ['card-footer'],
                        'card-order': 6
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('card-footer')) {
                            return {type: 'card_footer'};
                        }
                    }
                }),
                view: defaultView
            });

            domc.addType('card_image_bottom', {
                model: imageModel.extend({
                    defaults: Object.assign({}, imageModel.prototype.defaults, {
                        'custom-name': config.text.cardImageBottom,
                        classes: ['card-img-bottom'],
                        'card-order': 7
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('card-img-bottom')) {
                            return {type: 'card_image_bottom'};
                        }
                    }
                }),
                view: imageView
            });

            domc.addType('card_container', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.cardContainer,
                        classes: ['card-group'],
                        droppable: '.card',
                        traits: [
                            {
                                type: 'class_select',
                                options: [
                                    {value: 'card-group', name: 'Group'},
                                    {value: 'card-deck', name: 'Deck'},
                                    {value: 'card-columns', name: 'Columns'},
                                ],
                                label: config.labels.layout,
                            }
                        ].concat(defaultModel.prototype.defaults.traits)
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && _.intersection(el.classList, ['card-group','card-deck','card-columns']).length) {
                            return {type: 'card_container'};
                        }
                    }
                }),
                view: defaultView
            });

        }

        // Collapse

        if (blocks.collapse) {
            loadCollapse(editor, config);
        }

        // Dropdown

        if (blocks.dropdown) {
            loadDropdown(editor, config);
        }

    }

    // TYPOGRAPHY

    if (cats.typography) {

        // Header

        if (blocks.header) {
            domc.addType('header', {
                model: textModel.extend({
                    defaults: Object.assign({}, textModel.prototype.defaults, {
                        'custom-name': config.text.header,
                        tagName: 'h1',
                        traits: [
                            {
                                type: 'select',
                                options: [
                                    {value: 'h1', name: config.text.oneLargest},
                                    {value: 'h2', name: config.text.two},
                                    {value: 'h3', name: config.text.three},
                                    {value: 'h4', name: config.text.four},
                                    {value: 'h5', name: config.text.five},
                                    {value: 'h6', name: config.text.sixSmallest},
                                ],
                                label: config.labels.size,
                                name: 'tagName',
                                changeProp: 1
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    {value: 'display-1', name: config.text.oneLargest},
                                    {value: 'display-2', name: config.text.two},
                                    {value: 'display-3', name: config.text.three},
                                    {value: 'display-4', name: config.text.fourSmallest}
                                ],
                                label: config.labels.displayHeading
                            }
                        ].concat(textModel.prototype.defaults.traits)
                    }),

                }, {
                    isComponent(el) {
                        if(el && ['H1','H2','H3','H4','H5','H6'].includes(el.tagName)) {
                            return {type: 'header'};
                        }
                    }
                }),
                view: textView
            });
        }

        if (blocks.paragraph) {
            domc.addType('paragraph', {
                model: textModel.extend({
                    defaults: Object.assign({}, textModel.prototype.defaults, {
                        'custom-name': config.text.paragraph,
                        tagName: 'p',
                        traits: [
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.no},
                                    {value: 'lead', name: config.text.yes}
                                ],
                                label: config.labels.lead + '?'
                            }
                        ].concat(textModel.prototype.defaults.traits)
                    })
                }, {
                    isComponent(el) {
                        if(el && el.tagName && el.tagName === 'P') {
                            return {type: 'paragraph'};
                        }
                    }
                }),
                view: textView
            });
        }

    }

    if(cats.forms) {

        domc.addType('form', {
            model: defaultModel.extend({
                defaults: {
                    ...defaultModel.prototype.defaults,
                    droppable: ':not(form)',
                    draggable: ':not(form)',
                    traits: [{
                        type: 'select',
                        label: c.labels.trait_method,
                        name: 'method',
                        options: [
                            {value: 'post', name: 'POST'},
                            {value: 'get', name: 'GET'},
                        ]
                    },{
                        label: c.labels.trait_action,
                        name: 'action',
                    }],
                },

                init() {
                    this.listenTo(this, 'change:formState', this.updateFormState);
                },

                updateFormState() {
                    var state = this.get('formState');
                    switch (state) {
                        case 'success':
                            this.showState('success');
                            break;
                        case 'error':
                            this.showState('error');
                            break;
                        default:
                            this.showState('normal');
                    }
                },

                showState(state) {
                    var st = state || 'normal';
                    var failVis, successVis;
                    if (st === 'success') {
                        failVis = 'none';
                        successVis = 'block';
                    } else if (st === 'error') {
                        failVis = 'block';
                        successVis = 'none';
                    } else {
                        failVis = 'none';
                        successVis = 'none';
                    }
                    var successModel = this.getStateModel('success');
                    var failModel = this.getStateModel('error');
                    var successStyle = successModel.getStyle();
                    var failStyle = failModel.getStyle();
                    successStyle.display = successVis;
                    failStyle.display = failVis;
                    successModel.setStyle(successStyle);
                    failModel.setStyle(failStyle);
                },

                getStateModel(state) {
                    var st = state || 'success';
                    var stateName = 'form-state-' + st;
                    var stateModel;
                    var comps = this.get('components');
                    for (var i = 0; i < comps.length; i++) {
                        var model = comps.models[i];
                        if(model.get('form-state-type') === st) {
                            stateModel = model;
                            break;
                        }
                    }
                    if (!stateModel) {
                        var contentStr = formMsgSuccess;
                        if(st === 'error') {
                            contentStr = formMsgError;
                        }
                        stateModel = comps.add({
                            'form-state-type': st,
                            type: 'text',
                            removable: false,
                            copyable: false,
                            draggable: false,
                            attributes: {'data-form-state': st},
                            content: contentStr,
                        });
                    }
                    return stateModel;
                },
            }, {
                isComponent(el) {
                    if(el.tagName === 'FORM'){
                        return {type: 'form'};
                    }
                },
            }),

            view: defaultView.extend({
                events: {
                    submit(e) {
                        e.preventDefault();
                    }
                }
            }),
        });





        // INPUT
        domc.addType('input', {
            model: defaultModel.extend({
                defaults: {
                    ...defaultModel.prototype.defaults,
                    'custom-name': c.labels.input,
                    tagName: 'input',
                    draggable: 'form .form-group',
                    droppable: false,
                    traits: [
                        nameTrait,
                        placeholderTrait, {
                            label: c.labels.trait_type,
                            type: 'select',
                            name: 'type',
                            options: [
                                {value: 'text', name: c.labels.type_text},
                                {value: 'email', name: c.labels.type_email},
                                {value: 'password', name: c.labels.type_password},
                                {value: 'number', name: c.labels.type_number},
                            ]
                        }, requiredTrait
                    ],
                },
            }, {
                isComponent(el) {
                    if(el.tagName === 'INPUT') {
                        return {type: 'input'};
                    }
                },
            }),
            view: defaultView,
        });

        const inputType = domc.getType('input');
        const inputModel = inputType.model;




        // FROM GROUP INPUT
        domc.addType('form_group_input', {
            model: defaultModel.extend({
                defaults: {
                    ...defaultModel.prototype.defaults,
                    'custom-name': c.labels.form_group_input,
                    tagName: 'div',
                    traits: [],
                },
            }, {
                isComponent(el) {
                    if(el.tagName === 'DIV') {
                        return {type: 'div'};
                    }
                },
            }),
            view: defaultView,
        });




        // INPUT GROUP
        domc.addType('input_group', {
            model: defaultModel.extend({
                defaults: {
                    ...defaultModel.prototype.defaults,
                    'custom-name': c.labels.input_group,
                    tagName: 'div',
                    traits: [],
                },
            }, {
                isComponent(el) {
                    if(el.tagName === 'DIV') {
                        return {type: 'div'};
                    }
                },
            }),
            view: defaultView,
        });





        // TEXTAREA
        domc.addType('textarea', {
            model: inputModel.extend({
                defaults: {
                    ...inputModel.prototype.defaults,
                    'custom-name': c.labels.textarea,
                    tagName: 'textarea',
                    traits: [
                        nameTrait,
                        placeholderTrait,
                        requiredTrait
                    ]
                },
            }, {
                isComponent(el) {
                    if(el.tagName === 'TEXTAREA'){
                        return {type: 'textarea'};
                    }
                },
            }),
            view: defaultView,
        });





        // SELECT
        domc.addType('select', {
            model: defaultModel.extend({
                defaults: {
                    ...inputModel.prototype.defaults,
                    'custom-name': c.labels.select,
                    tagName: 'select',
                    traits: [
                        nameTrait, {
                            label: c.labels.trait_options,
                            type: 'select-options'
                        },
                        requiredTrait
                    ],
                },
            }, {
                isComponent(el) {
                    if(el.tagName === 'SELECT'){
                        return {type: 'select'};
                    }
                },
            }),
            view: preventDefaultClick(),
        });





        // CHECKBOX
        domc.addType('checkbox', {
            model: defaultModel.extend({
                defaults: {
                    ...inputModel.prototype.defaults,
                    'custom-name': c.labels.checkbox_name,
                    copyable: false,
                    droppable: false,
                    attributes: {type: 'checkbox'},
                    traits: [
                        idTrait,
                        nameTrait,
                        valueTrait,
                        requiredTrait,
                        checkedTrait
                    ],
                },

                init() {
                    this.listenTo(this, 'change:checked', this.handleChecked);
                },

                handleChecked() {
                    let checked = this.get('checked');
                    let attrs = this.get('attributes');
                    const view = this.view;

                    if (checked) {
                        attrs.checked = true;
                    } else {
                        delete attrs.checked;
                    }

                    if (view) {
                        view.el.checked = checked
                    }

                    this.set('attributes', { ...attrs });
                }
            }, {
                isComponent(el) {
                    if (el.tagName === 'INPUT' && el.type === 'checkbox') {
                        return {type: 'checkbox'};
                    }
                },
            }),
            view: defaultView.extend({
                events: {
                    'click': 'handleClick',
                },

                handleClick(e) {
                    e.preventDefault();
                },
            }),
        });

        var checkType = domc.getType('checkbox');





        // RADIO
        domc.addType('radio', {
            model: checkType.model.extend({
                defaults: {
                    ...checkType.model.prototype.defaults,
                    'custom-name': c.labels.radio,
                    attributes: {type: 'radio'},
                },
            }, {
                isComponent(el) {
                    if(el.tagName === 'INPUT' && el.type === 'radio'){
                        return {type: 'radio'};
                    }
                },
            }),
            view: checkType.view,
        });






        // Button

        if (blocks.button) {

            domc.addType('button', {
                model: linkModel.extend({
                    defaults: Object.assign({}, linkModel.prototype.defaults, {
                        'custom-name': config.text.button,
                        droppable: false,
                        attributes: {
                            role: 'button'
                        },
                        classes: ['btn'],
                        traits: [
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.none},
                                    ... contexts.map(function(v) { return {value: 'btn-'+v, name: _s.capitalize(v)} }),
                                    ... contexts.map(function(v) { return {value: 'btn-outline-'+v, name: _s.capitalize(v) + ' (Outline)'} })
                                ],
                                label: config.labels.context
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: 'Default'},
                                    ... Object.keys(sizes).map(function(k) { return {value: 'btn-'+k, name: sizes[k]} })
                                ],
                                label: config.labels.size
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.inline},
                                    {value: 'btn-block', name: config.text.block}
                                ],
                                label: config.labels.width
                            }
                        ].concat(linkModel.prototype.defaults.traits)
                    }),
                    /*init2() {
                      linkModel.prototype.init2.call(this); // call parent init in this context.
                    },*/
                    afterChange(e) {
                        if(this.attributes.type == 'button') {
                            if (this.attributes.classes.filter(function(klass) { return klass.id=='btn' }).length == 0) {
                                this.changeType('link');
                            }
                        }
                    }
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('btn')) {
                            return {type: 'button'};
                        }
                    }
                }),
                view: linkView
            });
        }

        // Button group

        if (blocks.button_group) {
            domc.addType('button_group', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.buttonGroup,
                        tagName: 'div',
                        classes: ['btn-group'],
                        droppable: '.btn',
                        attributes: {
                            role: 'group'
                        },
                        traits: [
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.default},
                                    ... Object.keys(sizes).map(function(k) { return {value: 'btn-group-'+k, name: sizes[k]} })
                                ],
                                label: config.labels.size
                            },
                            {
                                type: 'class_select',
                                options: [
                                    {value: '', name: config.text.horizontal},
                                    {value: 'btn-group-vertical', name: config.text.vertical},
                                ],
                                label: config.labels.size
                            },
                            {
                                type: 'Text',
                                label: config.labels.ariaLabel,
                                name: 'aria-label',
                                placeholder: 'A group of buttons'
                            }
                        ].concat(defaultModel.prototype.defaults.traits)
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('btn-group')) {
                            return {type: 'button_group'};
                        }
                    }
                }),
                view: defaultView
            });
        }

        // Button toolbar

        if (blocks.button_toolbar) {
            domc.addType('button_toolbar', {
                model: defaultModel.extend({
                    defaults: Object.assign({}, defaultModel.prototype.defaults, {
                        'custom-name': config.text.buttonToolbar,
                        tagName: 'div',
                        classes: ['btn-toolbar'],
                        droppable: '.btn-group',
                        attributes: {
                            role: 'toolbar'
                        },
                        traits: [
                            {
                                type: 'Text',
                                label: config.labels.ariaLabel,
                                name: 'aria-label',
                                placeholder: 'A toolbar of button groups'
                            }
                        ].concat(defaultModel.prototype.defaults.traits)
                    })
                }, {
                    isComponent(el) {
                        if(el && el.classList && el.classList.contains('btn-toolbar')) {
                            return {type: 'button_toolbar'};
                        }
                    }
                }),
                view: defaultView
            });
        }

        // LABEL
        domc.addType('label', {
            model: textModel.extend({
                defaults: {
                    ...textModel.prototype.defaults,
                    'custom-name': c.labels.label,
                    tagName: 'label',
                    traits: [forTrait],
                },
            }, {
                isComponent(el) {
                    if(el.tagName == 'LABEL'){
                        return {type: 'label'};
                    }
                },
            }),
            view: textView,
        });
    }
}
