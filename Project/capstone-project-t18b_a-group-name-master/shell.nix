with import <nixpkgs> {};
let
  my-python-packages = python-packages:
    with python-packages; [
      pylint
      pylint-django
      django
      autopep8
      ipython
    ];
  python-with-my-packages = python3.withPackages my-python-packages;
  vscodeWorkspaceSettings = pkgs.writeText "vscodeWorkspaceSettings"
    (builtins.toJSON {
      "python.linting.enabled" = true;
      "python.linting.pylintEnabled" = true;
      "python.linting.pylintPath" = "${python-with-my-packages}/bin/pylint";
      "python.linting.pylintArgs" = [ "--load-plugins" "pylint_django" ];

      "files.associations" = {
        "**/*.html" = "html";
        "**/templates/**/*.html" = "django-html";
        "**/templates/**/*" = "django-txt";
        "**/requirements{/**,*}.{txt,in}" = "pip-requirements";
      };
    });
in pkgs.mkShell {
  buildInputs = [ python-with-my-packages sqlite-interactive ];
  shellHook = ''
    ln -sf ${vscodeWorkspaceSettings} .vscode/settings.json
  '';
}
