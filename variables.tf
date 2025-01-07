
variable "zones" {
  description = "The Zone ID from the Cloudflare resource"
  type        = map(string)
}

variable "main_domain" {
  description = "The intended primary domain name"
  type        = string
}

variable "redirects" {
  description = "Alias domains"
  type        = list(string)
  default     = []
}

variable "repo" {
  description = "GitHub repo information"
  type = object({
    name        = string
    public      = bool
    description = string
    challenge   = string
  })
}
