<style lang="scss">
  .Tips {
    width: 100%;
    height: 100%;
    padding: 2em;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;

    &__Title {
        margin-bottom: 1em;
    }
  }

</style>

<template>
  <div class="Tips">
      <div class="Tips__Title headline">
          Tips
      </div>
      <v-alert
          border="top"
          colored-border
          type="info"
          icon="mdi-leaf"
          color="#6db33f"
          elevation="2">
          <p>When connecting to a Spring Boot service, make sure <a href="https://en.wikipedia.org/wiki/Cross-origin_resource_sharing" target="_blank">CORS</a> is enabled with this configuration:</p>
          <pre>
@Configuration
public class MvcConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("*")
            .allowCredentials(true);
    }
}
          </pre>
      </v-alert>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {AppConfig, appConfigService} from "@/shared/services/AppConfigService";
import {securityService} from "@/shared/services/SecurityService";

@Component
export default class Tips extends Vue {
}
</script>
