/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import _ from 'underscore';

const default_settings = {
        allow_dismiss: false
      , placement: {
          align: 'center'
        }
      }
    , notify = (type) => {
        return (options, settings) => {
          let merged_settings = _.defaults(settings || {}, default_settings)
            , fixed_settings = {
                element: 'body'
              , type: type

              , placement: _.extend(merged_settings.placement || {}, { from: 'top' })
              , z_index: 0x7fffffff
              , url_target: '_self'
              }
          ;

          if (merged_settings.delay === 0) {
            fixed_settings.allow_dismiss = true;
          }
          if (options.url) {
            fixed_settings.allow_dismiss = false;
          }

          return $.notify(options, _.extend(merged_settings, fixed_settings));
        };
      }
;

module.exports = {
  Success: notify('success')
, Warning: notify('warning')
, Danger: notify('danger')
, Info: notify('info')
};
