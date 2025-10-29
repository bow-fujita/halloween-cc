/**
 * Copyright (C) 2018-2025 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import Notify from './notify';

const fail = (xhr, status) => {
        let message
          , notify
          , settings = {}
        ;

        if (status == 'error') {
          switch (xhr.status) {
            case 0:
              message = 'Network Error'
              notify = Notify.Warning;
              break;
            case 404:
              message = 'Not Found';
              notify = Notify.Info;
              break;
            case 500:
              message = 'Application Error';
              notify = Notify.Danger;
              const json = xhr.responseJSON;
              if (json) {
                message += ` (${json.type})<br />${json.message}`;
              }
              settings.delay = 0;
              break;
          }
        }
        else if (status == 'timeout') {
          message = 'Communication Timed Out';
          notify = Notify.Warning;
        }
        else {
          message = 'Unexpected Error';
          notify = Notify.Danger;
        }

        notify(message, settings);
      }
    , ajax = (fn) => {
        return function() {
          return fn.apply($, arguments).fail(fail);
        };
      }
;

const mainAjax = ajax($.ajax);

[
  'getJSON'
, 'post'
]
.forEach((fn) => {
  mainAjax[fn] = ajax($[fn]);
});

export default mainAjax;
