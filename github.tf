variable "github_token" {
  default = ""
}

provider "github" {
  token = var.github_token
}

resource "github_repository" "github_repo" {
  name         = var.repo.name
  description  = var.repo.description
  homepage_url = "https://${var.main_domain}"

  visibility                  = var.repo.public ? "public" : "private"
  has_discussions             = false
  has_downloads               = false
  has_issues                  = true
  allow_auto_merge            = true
  allow_merge_commit          = false
  allow_rebase_merge          = false
  allow_squash_merge          = true
  squash_merge_commit_title   = "PR_TITLE"
  squash_merge_commit_message = "PR_BODY"
  delete_branch_on_merge      = true

  pages {
    build_type = "workflow"
    cname      = var.main_domain
  }
}
