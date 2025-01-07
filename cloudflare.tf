variable "cloudflare_api_token" {
  default = ""
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_record" "a_records" {
  for_each = toset([
    "185.199.111.153",
    "185.199.110.153",
    "185.199.109.153",
    "185.199.108.153"
  ])
  zone_id = var.zones[var.main_domain]
  content = each.value
  name    = var.main_domain
  proxied = true
  ttl     = 1
  type    = "A"
}

resource "cloudflare_record" "aaaa_records" {
  for_each = toset([
    "2606:50c0:8003::153",
    "2606:50c0:8002::153",
    "2606:50c0:8001::153",
    "2606:50c0:8000::153"
  ])
  zone_id = var.zones[var.main_domain]
  content = each.value
  name    = var.main_domain
  proxied = true
  ttl     = 1
  type    = "AAAA"
}

resource "cloudflare_record" "mail_records_dmarc" {
  for_each = setunion([var.main_domain], var.redirects)
  zone_id  = var.zones[each.value]
  name     = "_dmarc"
  content  = "\"v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;\""
  proxied  = false
  ttl      = 1
  type     = "TXT"
}

resource "cloudflare_record" "mail_records_domainkey" {
  for_each = setunion([var.main_domain], var.redirects)
  zone_id  = var.zones[each.value]
  name     = "*._domainkey"
  content  = "\"v=DKIM1; p=\""
  proxied  = false
  ttl      = 1
  type     = "TXT"
}

resource "cloudflare_record" "mail_records_spf" {
  for_each = setunion([var.main_domain], var.redirects)
  zone_id  = var.zones[each.value]
  name     = each.value
  content  = "\"v=spf1 -all\""
  proxied  = false
  ttl      = 1
  type     = "TXT"
}

resource "cloudflare_record" "github_challenge" {
  zone_id = var.zones[var.main_domain]
  name    = "_github-pages-challenge-evancharlton"
  content = "\"${var.repo.challenge}\""
  proxied = false
  ttl     = 1
  type    = "TXT"
}

resource "cloudflare_record" "cnames_www" {
  zone_id = var.zones[var.main_domain]
  name    = "www"
  content = var.main_domain
  proxied = true
  ttl     = 1
  type    = "CNAME"
}

resource "cloudflare_record" "ip4_redirect_www" {
  for_each = {
    for pair in setproduct(
      toset(var.redirects),
      ["@", "www"]
      ) : "${pair[1]}/${pair[0]}}" => {
      domain = pair[0]
      name   = pair[1]
    }
  }

  zone_id = var.zones[each.value.domain]
  name    = each.value.name
  content = "192.0.2.1"
  proxied = true
  ttl     = 1
  type    = "A"
}

resource "cloudflare_record" "ip6_redirect_www" {
  for_each = {
    for pair in setproduct(
      toset(var.redirects),
      ["@", "www"]
      ) : "${pair[1]}/${pair[0]}}" => {
      domain = pair[0]
      name   = pair[1]
    }
  }

  zone_id = var.zones[each.value.domain]
  name    = each.value.name
  content = "100::"
  proxied = true
  ttl     = 1
  type    = "AAAA"
}

resource "cloudflare_ruleset" "redirect_to_main" {
  for_each = toset(var.redirects)

  zone_id     = var.zones[each.value]
  name        = "Redirect to ${var.main_domain}"
  description = "Redirect to ${var.main_domain}"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules {
    action = "redirect"
    action_parameters {
      from_value {
        preserve_query_string = true
        status_code           = 302
        target_url {
          expression = "concat(\"https://${var.main_domain}\", http.request.uri.path)"
        }
      }
    }
    expression = "true"
  }
}
