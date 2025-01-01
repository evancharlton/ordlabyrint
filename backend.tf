terraform {
  backend "gcs" {
    prefix = "ordlabyrint/terraform"
    bucket = "terraform-remote-backend-2180c2249d350f10"
  }
}
