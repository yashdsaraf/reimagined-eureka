export interface DocItem {
  title: string
  url?: string
  children?: DocItem[]
}

export const DOCS: DocItem[] = [
  {
    title: 'Projects',
    children: [
      {
        title: 'How to create a project?',
        url: 'assets/docs/projects/how_to_create_project.html'
      },
      {
        title: 'How to open, save or import a project?',
        url: 'assets/docs/projects/How_to_open_save_or_import_a_project.html'
      }
    ]
  },
  {
    title: 'Plugins',
    children: [
      {
        title: 'What is a plugin and how does it work?',
        url: 'assets/docs/plugins/How_does_a_plugin_work.html'
      }
    ]
  },
  {
    title: 'Execution encironments',
    children: [
      {
        title: 'What is an entrypoint?',
        url: 'assets/docs/exec_env/What_is_an_entrypoint.html'
      },
      {
        title: 'How to change run commands and/or entrypoint?',
        url: 'assets/docs/exec_env/How_to_change_run_commands_andor_entrypoint.html'
      },
      {
        title: 'How to change editor themes?',
        url: 'assets/docs/exec_env/How_to_change_editor_themes.html'
      },
      {
        title: 'How to manage files and folders in my project?',
        url: 'assets/docs/exec_env/How_to_manage_files_and_folders_in_my_project.html'
      }
    ]
  },
  {
    title: 'Marketplace',
    children: [
      {
        title: 'How to install a plugin?',
        url: 'assets/docs/marketplace/How_to_install_a_plugin.html'
      },
      {
        title: 'Can I install more than one plugin?',
        url: 'assets/docs/marketplace/Can_I_install_more_than_one_plugin.html'
      },
      {
        title: 'How to create a plugin?',
        url: 'assets/docs/marketplace/How_to_create_a_plugin.html'
      },
      {
        title: 'How to become a developer?',
        url: 'assets/docs/marketplace/How_to_become_a_developer.html'
      }
    ]
  },
  {
    title: 'Miscellaneous',
    children: [
      {
        title: 'What are Identicons?',
        url: 'assets/docs/miscellaneous/What_are_Identicons.html'
      },
      {
        title: 'What are different user permissions?',
        url: 'assets/docs/miscellaneous/What_are_different_user_permissions.html'
      },
      {
        title: 'How to share code snippets from my project?',
        url: 'assets/docs/miscellaneous/How_to_share_code_snippets_from_my_project.html'
      }
    ]
  }
]
