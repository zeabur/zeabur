{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/

  # https://devenv.sh/packages/
  packages = [ ];

  # https://devenv.sh/scripts/
  scripts.dev.exec = "pnpm dev";

  enterShell = ''
    pnpm install
  '';

  # https://devenv.sh/tests/
  enterTest = '''';

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/languages/
  # languages.nix.enable = true;
  languages.javascript.enable = true;
  languages.javascript.corepack.enable = true;

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # https://devenv.sh/processes/
  # processes.ping.exec = "ping example.com";

  # See full reference at https://devenv.sh/reference/options/
}
