import { Routes, RouterModule } from '@angular/router';

import { Website } from './website.component';
import { NgModule } from '@angular/core';
import { Navigation } from './components/navigation/navigation.component';
import { Articles } from './components/articles/articles.component';

import { Templates } from './components/templates/templates.component';
import { Widget } from './components/widget/widget.component';
import { Pagination } from './components/pagination/pagination.component';

const routes: Routes = [
  {
    path: '',
    component: Website,
    data: {
      title: 'Website'
    },
    children: [
      { path: 'navigation', component: Navigation },
      { path: 'articles', component: Articles },
      { path: 'template', component: Templates },
      { path: 'widget', component: Widget },
      { path: 'pagination', component: Pagination },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class WebsiteRoutingModule { }
