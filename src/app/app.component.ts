import {
  Component,
  Inject,
  LOCALE_ID,
  Renderer2
} from '@angular/core';
import {
  ConfigService
} from '../@vex/services/config.service';
import {
  Settings
} from 'luxon';
import {
  DOCUMENT
} from '@angular/common';
import {
  Platform
} from '@angular/cdk/platform';
import {
  NavigationService
} from '../@vex/services/navigation.service';
import icAssignment from '@iconify/icons-feather/file-text';
import icEvent from '@iconify/icons-feather/calendar';
import icInform from '@iconify/icons-feather/alert-circle';
import icAdmin from '@iconify/icons-feather/dollar-sign';
import icHome from '@iconify/icons-feather/home';
import icChartLine from '@iconify/icons-fa-solid/chart-line';
import ictruck from '@iconify/icons-feather/truck';
import icbriefcase from '@iconify/icons-feather/briefcase';
import icMinus from '@iconify/icons-feather/minus';
import icVirtual from '@iconify/icons-feather/cast';
import icPerson from '@iconify/icons-feather/user-plus';
import icUsers from '@iconify/icons-feather/users';
import icMale from '@iconify/icons-feather/circle';
import settings from '@iconify/icons-feather/settings';
import icUserscircle from '@iconify/icons-feather/user';
import icbill from '@iconify/icons-fa-solid/money-bill';
import iccar from '@iconify/icons-fa-solid/car';
import icdatabase from '@iconify/icons-feather/database';
import eye from '@iconify/icons-feather/eye';

import {
  LayoutService
} from '../@vex/services/layout.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  filter,
  map
} from 'rxjs/operators';
import {
  coerceBooleanProperty
} from '@angular/cdk/coercion';
import {
  SplashScreenService
} from '../@vex/services/splash-screen.service';
import {
  Style,
  StyleService
} from '../@vex/services/style.service';
import {
  ConfigName
} from '../@vex/interfaces/config-name.model';


@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vex';

  constructor(private configService: ConfigService,
    private styleService: StyleService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private splashScreenService: SplashScreenService) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

    /**
     * Customize the template to your needs with the ConfigService
     * Example:
     *  this.configService.updateConfig({
     *    sidenav: {
     *      title: 'Custom App',
     *      imageUrl: '//placehold.it/100x100',
     *      showCollapsePin: false
     *    },
     *    showConfigButton: false,
     *    footer: {
     *      visible: false
     *    }
     *  });
     */

    /**
     * Config Related Subscriptions
     * You can remove this if you don't need the functionality of being able to enable specific configs with queryParams
     * Example: example.com/?layout=apollo&style=default
     */
    this.route.queryParamMap.pipe(
      map(queryParamMap => queryParamMap.has('rtl') && coerceBooleanProperty(queryParamMap.get('rtl'))),
    ).subscribe(isRtl => {
      this.document.body.dir = isRtl ? 'rtl' : 'ltr';
      this.configService.updateConfig({
        rtl: isRtl
      });
    });

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('layout'))
    ).subscribe(queryParamMap => this.configService.setConfig(queryParamMap.get('layout') as ConfigName));

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('style'))
    ).subscribe(queryParamMap => this.styleService.setStyle(queryParamMap.get('style') as Style));

    const miVar = true;



    this.navigationService.items = [{
        type: 'subheading',
        label: 'Menú principal',
        children: [{
            type: 'link',
            label: 'Programación',
            route: '/app/home',
            icon: icHome
          },
          {
            type: 'link',
            label: 'Estadísticas',
            route: '/app/estadisticas',
            icon: icChartLine
          },
          {
            type: 'link',
            label: 'Calendario',
            route: '/app/appointment',
            icon: icEvent
          },
          {
            type: 'link',
            label: 'Aprobacion',
            route: '/app/aprobacion',
            icon: eye
          },
          {
            type: 'link',
            label: 'Despachos',
            route: '/app/despachos',
            icon: iccar
          },
          {
            type: 'link',
            label: 'Pagos',
            route: '/app/pagos',
            icon: icbill
          },
          {
            type: 'link',
            label: 'Panel',
            route: '/app/panelcliente',
            icon: icbill
          },
          {
            type: 'dropdown',
            label: 'Configuraciones',
            icon: settings,
            children: [
              {
                type: 'dropdown',
                label: 'Usuarios',
                icon: icUserscircle,
                children: [
                  {
                    type: 'link',
                    label: 'General',
                    route: '/app/usuarios',
                    icon: icMale
                  },
                  {
                    type: 'link',
                    label: 'Vendedores',
                    route: '/app/vendedores',
                    icon: icbriefcase
                  },
                  {
                    type: 'link',
                    label: 'Conductores',
                    route: '/app/conductores',
                    icon: ictruck
                  }
                ]
              },
              {
                type: 'link',
                label: 'Clientes',
                route: '/app/clientes',
                icon: icUsers
              },
              {
                type: 'link',
                label: 'Tipo de concreto',
                route: '/app/productos',
                icon: icdatabase
              }
            ]
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Acceso rápido',
        children: [
          // {
          //   type: 'link',
          //   label: 'Nuevo paciente',
          //   route: '/app/informs',
          //   icon: icPerson
          // },
          {
            type: 'link',
            label: 'nuevo pedido',
            route: '/app/appointment',
            icon: icAssignment
          }
        ]
      }
    ];
  }


}