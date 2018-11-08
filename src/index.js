import grapesjs from 'grapesjs';
import loadCommands from './commands';
import loadTraits from './traits';
import loadComponents from './components';
import loadBlocks from './blocks';
import loadDevices from './devices';

export default grapesjs.plugins.add('grapesjs-blocks-bootstrap4', (editor, opts = {}) => {

  window.editor = editor;

  const opts_blocks = opts.blocks || {};
  const opts_labels = opts.labels || {};
  const opts_categories = opts.blockCategories || {};
  const optsText = opts.text || {};
  const optsSizes = opts.sizes || {};
  delete opts['blocks'];
  delete opts['labels'];
  delete opts['text'];
  delete opts['sizes'];
  delete opts['blockCategories'];

  const default_blocks = {
    default: true,
    text: true,
    link: true,
    image: true,
    // LAYOUT
    container: true,
    row: true,
    column: true,
    column_break: true,
    media_object: true,
    // COMPONENTS
    alert: true,
    badge: true,
    button: true,
    button_group: true,
    button_toolbar: true,
    card: true,
    card_container: true,
    collapse: true,
    dropdown: true,
    // TYPOGRAPHY
    header: true,
    paragraph: true,
    // BASIC
    list: true,
    // FORMS
    form: true,
    input: true,
    form_group_input: true,
    input_group: true,
    textarea: true,
    select: true,
    label: true,
    checkbox: true,
    radio: true,
  };

  const default_labels = {
    // LAYOUT
    container: 'Container',
    row: 'Row',
    column: 'Column',
    column_break: 'Column Break',
    media_object: 'Media Object',
    // COMPONENTS
    alert: 'Alert',
    badge: 'Badge',
    button: 'Button',
    button_group: 'Button Group',
    button_toolbar: 'Button Toolbar',
    card: 'Card',
    card_container: 'Card Container',
    collapse: 'Collapse',
    dropdown: 'Dropdown',
    dropdown_menu: 'Dropdown Menu',
    dropdown_item: 'Dropdown Item',
    // TYPOGRAPHY
    text: 'Text',
    header: 'Header',
    paragraph: 'Paragraph',
    // BASIC
    image: 'Image',
    imageOverlay: 'Image overlay',
    imageBottom: 'Image bottom',
    imageTop: 'Image top',
    link: 'Link',
    list: 'Simple List',
    // FORMS
    form: 'Form',
    input: 'Input',
    form_group_input: 'Form group input',
    input_group: 'Input group',
    textarea: 'Textarea',
    select: 'Select',
    select_option: '- Select option -',
    option: 'Option',
    label: 'Label',
    checkbox: 'Checkbox',
    radio: 'Radio',
    trait_method: 'Method',
    trait_action: 'Action',
    trait_state: 'State',
    trait_id: 'ID',
    trait_for: 'For',
    trait_name: 'Name',
    trait_placeholder: 'Placeholder',
    trait_value: 'Value',
    trait_required: 'Required',
    trait_type: 'Type',
    trait_options: 'Options',
    trait_checked: 'Checked',
    type_text: 'Text',
    type_email: 'Email',
    type_password: 'Password',
    type_number: 'Number',
    type_submit: 'Submit',
    type_reset: 'Reset',
    type_button: 'Button',
    textColor: 'Text color',
    backgroundColor: 'Background color',
    borderWidth: 'Border width',
    borderColor: 'Border color',
    borderRadius: 'Border radius',
    target: 'Target',
    toggles: 'Toggles',
    alternateText: 'Alternate text',
    sourceURL: 'Source (URL)',
    width: 'Width',
    gutters: 'Gutters',
    xsWidth: 'MD Width',
    xsOffset: 'MD Offset',
    smWidth: 'MD Width',
    smOffset: 'MD Offset',
    mdWidth: 'MD Width',
    mdOffset: 'MD Offset',
    lgWidth: 'MD Width',
    lgOffset: 'MD Offset',
    xlWidth: 'MD Width',
    xlOffset: 'MD Offset',
    context: 'Context',
    shape: 'Shape',
    body: 'Body',
    footer: 'Footer',
    layout: 'Layout',
    size: 'Size',
    displayHeading: 'Display heading',
    lead: 'Lead',
    ariaLabel: 'Aria label',
    initialState: 'Initial state'
  };

  const default_categories = {
    'layout': true,
    'components': true,
    'typography': true,
    'basic': true,
    'forms': true,
  };

  const defaultText = {
      layout: 'Layout',
      components: 'Components',
      typography: 'Typography',
      basic: 'Basic',
      forms: 'Forms',
      dropdown: 'Dropdown',
      closed: 'Closed',
      open: 'Open',
      clickToToggle: 'Click to toggle',
      dropdownMenu: 'Dropdown menu',
      dropdownHeader: 'Dropdown header',
      dropdownItem: 'Dropdown item',
      default: 'Default',
      none: 'None',
      text: 'Text',
      link: 'Text',
      container: 'Text',
      fixed: 'Text',
      fluid: 'Text',
      row: 'Text',
      yes: 'Text',
      no: 'Text',
      column: 'Text',
      equal: 'Text',
      variable: 'Text',
      columnBreak: 'Column break',
      mediaObject: 'Text',
      mediaBody: 'Text',
      alert: 'Text',
      badge: 'Text',
      card: 'Text',
      cardImageTop: 'Text',
      cardHeader: 'Text',
      cardImage: 'Text',
      cardImageOverlay: 'Text',
      cardBody: 'Text',
      cardFooter: 'Text',
      cardImageBottom: 'Text',
      cardContainer: 'Text',
      header: 'Text',
      oneLargest: 'Text',
      two: 'Text',
      three: 'Text',
      four: 'Text',
      five: 'Text',
      sixSmallest: 'Text',
      fourSmallest: 'Text',
      paragraph: 'Text',
      button: 'Text',
      inline: 'Text',
      block: 'Text',
      buttonGroup: 'Text',
      dafault: 'Text',
      horizontal: 'Text',
      vertical: 'Text',
      buttonToolbar: 'Text',
  };

  const defaultSizes = {
      extraSmall: 'Extra Small',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      extraLarge: 'Extra Large'
  };

  let options = { ...{
    blocks: Object.assign(default_blocks, opts_blocks),
    labels: Object.assign(default_labels, opts_labels),
    blockCategories: Object.assign(default_categories, opts_categories),
    text: Object.assign(defaultText, optsText),
    sizes: Object.assign(defaultSizes, optsSizes),
    gridDevices: true,
    gridDevicesPanel: false,
  },  ...opts };

 editor.addComponents(`
    <style>

      /* Layout */

      .gjs-dashed .container, .gjs-dashed .container-fluid,
      .gjs-dashed .row,
      .gjs-dashed .col, .gjs-dashed [class^="col-"] {
        min-height: 1.5rem !important;
      }
      .gjs-dashed .w-100 {
        min-height: .25rem !important;
        background-color: rgba(0,0,0,0.1);
      }
      .gjs-dashed img {
        min-width: 25px;
        min-height: 25px;
        background-color: rgba(0,0,0,0.5);
      }

      /* Components */
      
      .gjs-dashed .btn-group,
      .gjs-dashed .btn-toolbar {
        padding-right: 1.5rem !important;
        min-height: 1.5rem !important;
      }
      .gjs-dashed .card,
      .gjs-dashed .card-group, .gjs-dashed .card-deck, .gjs-dashed .card-columns {
        min-height: 1.5rem !important;
      }
      .gjs-dashed .collapse {
        display: block !important;
        min-height: 1.5rem !important;
      }
      .gjs-dashed .dropdown {
        display: block !important;
        min-height: 1.5rem !important;
      }
      .gjs-dashed .dropdown-menu {
        min-height: 1.5rem !important;
        display: block !important;
      }

    </style>
  `);

  // Add components
  loadCommands(editor, options);
  loadTraits(editor, options);
  loadComponents(editor, options);
  loadBlocks(editor, options);
  loadDevices(editor, options);
});
