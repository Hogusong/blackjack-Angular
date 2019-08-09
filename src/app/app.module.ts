import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuComponent } from './pages/menu/menu.component';
import { PlayerListComponent } from './pages/player/player-list/player-list.component';
import { PlayerNewComponent } from './pages/player/player-new/player-new.component';
import { PlayerRemoveComponent } from './pages/player/player-remove/player-remove.component';
import { GameComponent } from './pages/game/game.component';
import { BjChartsComponent } from './pages/help/bj-charts/bj-charts.component';
import { GameGuideComponent } from './pages/help/game-guide/game-guide.component';
import { OptionsComponent } from './pages/help/options/options.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PlayerListComponent,
    PlayerNewComponent,
    PlayerRemoveComponent,
    GameComponent,
    BjChartsComponent,
    GameGuideComponent,
    OptionsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
