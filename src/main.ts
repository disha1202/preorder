import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import './registerServiceWorker'

import { IonicVue } from '@ionic/vue';
import i18n from './i18n'
import store from './store'
import { DateTime } from 'luxon';


/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

const app = createApp(App)
  .use(IonicVue, {
    mode: 'md'
  })
  .use(router)
  .use(i18n)
  .use(store);
 
// Filters are removed in Vue 3 and global filter introduced https://v3.vuejs.org/guide/migration/filters.html#global-filters
app.config.globalProperties.$filters = {
  formatDate(value: any, inFormat?: string, outFormat = 'MM-dd-yyyy') {
    // TODO Make default format configurable and from environment variables
    if(inFormat){
      return DateTime.fromFormat(value, inFormat).toFormat(outFormat);
    }
    return DateTime.fromISO(value).toFormat(outFormat);
  },
  formatUtcDate(value: any, inFormat?: any, outFormat = 'MM-dd-yyyy') {
    // TODO Make default format configurable and from environment variables
    const userProfile = store.getters['user/getUserProfile'];
    // TODO Fix this setDefault should set the default timezone instead of getting it everytiem and setting the tz
    return DateTime.utc(value, inFormat).setZone(userProfile.userTimeZone).toFormat(outFormat);
  },
  getOrderIdentificationId(identifications: any, id: string) {
    let  externalId = ''
    if (identifications) {
      const externalIdentification = identifications.find((identification: any) => identification.startsWith(id))
      const externalIdentificationSplit = externalIdentification ? externalIdentification.split('/') : [];
      externalId = externalIdentificationSplit[1] ? externalIdentificationSplit[1] : '';
    }
    return externalId;
  },
  getFeature(featureHierarchy: any, featureKey: string) {
    let  featureValue = ''
    if (featureHierarchy) {
      const feature = featureHierarchy.find((featureItem: any) => featureItem.startsWith(featureKey))
      const featureSplit = feature ? feature.split('/') : [];
      featureValue = featureSplit[2] ? featureSplit[2] : '';
    }
    return featureValue;
  },
  groupFeatures(featureHierarchy: any) {
    if (featureHierarchy) {
      const features = featureHierarchy.reduce((filteredFeatures: any, feature: any) => {
        const featureSplit = feature.split('/');
        if (featureSplit[1] && featureSplit[2]) {
          filteredFeatures[featureSplit[1]] ? filteredFeatures[featureSplit[1]].push(featureSplit[2]) : filteredFeatures[featureSplit[1]] = [featureSplit[2]]
        }  
        return filteredFeatures;
      }, {});
      const sortedFeatures = {} as any;
      Object.keys(features).sort().map((key) => sortedFeatures[key] = features[key].join(', '))
      return sortedFeatures;
    }
  },
  getFeatures(featureHierarchy: any, featureKey: string) {
    let  featuresValue = ''
    if (featureHierarchy) {
      featureHierarchy.filter((featureItem: any) => featureItem.startsWith(featureKey)).forEach((feature: any) => {
        const featureSplit = feature ? feature.split('/') : [];
        const featureValue = featureSplit[2] ? featureSplit[2] : '';
        featuresValue += featuresValue.length > 0 ? ", " + featureValue : featureValue;
      })
    }
    // trim removes extra white space from beginning for the first feature
    return featuresValue.trim();
  },
  getFeaturesList(featureHierarchy: any, featureKey: string) {
    let  featuresList = []
    if (featureHierarchy) {
      featuresList = featureHierarchy.filter((featureItem: any) => featureItem.startsWith(featureKey)).map((feature: any) => {
        const featureSplit = feature ? feature.split('/') : [];
        const featureValue = featureSplit[2] ? featureSplit[2] : '';
        return featureValue;
      })
    }
    return featuresList;
  },
  getCustomerLoyalty(orderNotes: any, cusotmerLoyaltyOptions: any) {
    let  customerLoyalty = '' as any
    if (orderNotes && cusotmerLoyaltyOptions) {
      for (const customerLoyaltyOption of Object.entries(cusotmerLoyaltyOptions)) {
          if (orderNotes.includes(customerLoyaltyOption[0])) {
            customerLoyalty = customerLoyaltyOption[1];
          }
      }
    }
    return customerLoyalty;
  },
}

router.isReady().then(() => {
  app.mount('#app');
});