export default (editor, config = {}) => {
  const c = config;
  const deviceManager = editor.DeviceManager;
  if(c.gridDevices) {
    deviceManager.add(config.sizes.extraSmall, '575px');
    deviceManager.add(config.sizes.small, '767px');
    deviceManager.add(config.sizes.medium, '991px');
    deviceManager.add(config.sizes.large, '1199px');
    deviceManager.add(config.sizes.extraLarge, '100%');


    if(c.gridDevicesPanel) {
      const panels = editor.Panels;
      const commands = editor.Commands;
      var panelDevices = panels.addPanel({id: 'devices-buttons'});
      var deviceBtns = panelDevices.get('buttons');
      deviceBtns.add([{
        id: 'deviceXl',
        command: 'set-device-xl',
        className: 'fa fa-desktop',
        text: 'XL',
        attributes: {'title': config.sizes.extraLarge},
        active: 1
      },{
        id: 'deviceLg',
        command: 'set-device-lg',
        className: 'fa fa-desktop',
        attributes: {'title': config.sizes.large}
      },{
        id: 'deviceMd',
        command: 'set-device-md',
        className: 'fa fa-tablet',
        attributes: {'title': config.sizes.medium}
      },{
        id: 'deviceSm',
        command: 'set-device-sm',
        className: 'fa fa-mobile',
        attributes: {'title': config.sizes.small}
      },{
        id: 'deviceXs',
        command: 'set-device-xs',
        className: 'fa fa-mobile',
        attributes: {'title': config.sizes.extraSmall}
      }]);

      commands.add('set-device-xs', {
        run: function(editor) {
          editor.setDevice(config.sizes.extraSmall);
        }
      });
      commands.add('set-device-sm', {
        run: function(editor) {
          editor.setDevice(config.sizes.small);
        }
      });
      commands.add('set-device-md', {
        run: function(editor) {
          editor.setDevice(config.sizes.medium);
        }
      });
      commands.add('set-device-lg', {
        run: function(editor) {
          editor.setDevice(config.sizes.large);
        }
      });
      commands.add('set-device-xl', {
        run: function(editor) {
          editor.setDevice(config.sizes.extraLarge);
        }
      });
    }


  }
}
