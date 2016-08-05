module AdvancedUk
  module Mixins
    module MysageoneCountry
      # Module for MySageOneClient
      module MySageOneClient
        extend ActiveSupport::Concern

        included do
          class << self
            # Get the service path of a service.  Can supply a country code for :mysageone
            def service_path_with_country_code(service, path = "", country_code = nil)
              service_name = validate_for_ms1(service, country_code, self.config)

              service_path_without_country_code(service_name, path)
            end
            alias_method_chain :service_path, :country_code

            # Validates the ms1 path MUST have a country code.
            def validate_for_ms1(service_uid, country_code, config)
              if service_uid == :mysageone && multiple_ms1?(config)
                raise('country_code needed to specify MS1 url') unless country_code
                service_name = "#{service_uid}_#{country_code}".to_sym
                raise("MySageOneClient configuration missing for #{service_name}") unless config.servers[service_name]
                service_name
              else
                return service_uid
              end
            end

            # Are there multiple :mysageone server configurations
            def multiple_ms1?(config = self.config)
              config.servers.select{|s| s.to_s.include?('mysageone')}.count > 1
            end
          end
        end
      end
    end
  end
end

::MySageOneClient.send :include, AdvancedUk::Mixins::MysageoneCountry::MySageOneClient
