import pygame, sys


class Missile:
    def __init__(self, screen, x):
        self.screen = screen
        self.x = x
        self.y = 591
        self.has_exploded = False

    def move(self):
        self.y = self.y - 5

    def draw(self):
        pygame.draw.line(self.screen, (0, 255, 0), (self.x, self.y), (self.x, self.y + 8), 4)


class Fighter:
    def __init__(self, screen, x, y):
        self.screen = screen
        self.image = pygame.image.load("fighter.png").convert()
        self.image.set_colorkey((255, 255, 255))
        self.x = x
        self.y = y
        self.missiles = []
        self.fire_sound = pygame.mixer.Sound("pew.wav")

    def draw(self):
        self.screen.blit(self.image, (self.x, self.y))

    def fire(self):
        self.missiles.append(Missile(self.screen, self.x + 50))
        # self.fire_sound.play()

    def remove_exploded_missles(self):
        for k in range(len(self.missiles) - 1, -1, -1):
            if self.missiles[k].has_exploded or self.missiles[k].y < 0:
                del self.missiles[k]


class Badguy:
    def __init__(self, screen, x, y, speed):
        self.is_dead = False
        self.screen = screen
        self.x = x
        self.y = y
        self.speed = speed * 1.5
        self.image = pygame.image.load("badguy.png")
        self.original_x = x

    def move(self):
        self.x = self.x + self.speed
        if abs(self.x - self.original_x) > 100:
            self.speed = -self.speed
            self.y = self.y + 4 * abs(self.speed)

    def draw(self):
        self.screen.blit(self.image, (self.x, self.y))

    def hit_by(self, missile):
        badguy_hitbox = pygame.Rect(self.x, self.y, self.image.get_width(), self.image.get_height())
        return badguy_hitbox.collidepoint(missile.x, missile.y)


class EnemyFleet:
    def __init__(self, screen, enemy_rows):
        self.badguys = []
        self.explosion_sound = pygame.mixer.Sound("explosion.wav")
        for j in range(enemy_rows):
            for k in range(8):
                self.badguys.append(Badguy(screen, 80 * k, 50 * j + 20, enemy_rows))

    @property
    def is_defeated(self):
        return len(self.badguys) == 0

    def move(self):
        for badguy in self.badguys:
            badguy.move()

    def draw(self):
        for badguy in self.badguys:
            badguy.draw()

    def remove_dead_badguys(self):
        for k in range(len(self.badguys) - 1, -1, -1):
            if self.badguys[k].is_dead:
                del self.badguys[k]
                self.explosion_sound.play()


class Scoreboard:
    def __init__(self, screen):
        self.screen = screen
        self.score = 0
        self.font = pygame.font.Font(None, 30)

    def draw(self):
        # DONE: Convert the score number into a string called as_text using the format "Score: " + number
        as_text = "Score: " + str(self.score)

        # DONE: Using the font object, convert the string into an image that can be placed onto the screen
        as_image = self.font.render(as_text, True, (255, 255, 255))

        # DONE: Using the screen, blit as_image at (5, 5)
        self.screen.blit(as_image, (5, 5))


def main():
    allow_supergun = False
    game_over = False
    pygame.init()
    clock = pygame.time.Clock()
    pygame.display.set_caption("Space Invaders")
    screen = pygame.display.set_mode((640, 650))

    enemy_rows = 4
    enemy_fleet = EnemyFleet(screen, enemy_rows)
    fighter = Fighter(screen, 320, 590)

    # DONE: Create a Scoreboard, called scoreboard, using the screen at location 5, 5
    scoreboard = Scoreboard(screen)
    win_sound = pygame.mixer.Sound("win.wav")
    lose_sound = pygame.mixer.Sound("lose.wav")

    while True:
        clock.tick(60)
        for event in pygame.event.get():
            pressed_keys = pygame.key.get_pressed()
            if pressed_keys[pygame.K_SPACE] and event.type == pygame.KEYDOWN:
                if not game_over:
                    fighter.fire_sound.play()  # moved here in case of supergun
                    fighter.fire()
            if event.type == pygame.QUIT:
                sys.exit()
        screen.fill((0, 0, 0))
        fighter.draw()
        enemy_fleet.draw()
        scoreboard.draw()

        for missile in fighter.missiles:
            missile.draw()
        if game_over:
            game_over_image = pygame.image.load("gameover.png")
            screen.blit(game_over_image, (170, 200))
            pygame.display.update()
            continue

        # Moved the movements below the game over area.
        pressed_keys = pygame.key.get_pressed()
        if pressed_keys[pygame.K_LEFT] and fighter.x > -50:
            fighter.x = fighter.x - 5
        if pressed_keys[pygame.K_RIGHT] and fighter.x < 590:
            fighter.x = fighter.x + 5
        enemy_fleet.move()

        if allow_supergun:
            if pressed_keys[pygame.K_SPACE]:
                fighter.fire()

        for missile in fighter.missiles:
            missile.move()
            #missile.draw()  # Also moved earlier.

        for badguy in enemy_fleet.badguys:
            for missile in fighter.missiles:
                if badguy.hit_by(missile):
                    # DONE: Increment the score of the scoreboard by 100
                    scoreboard.score = scoreboard.score + 100
                    badguy.is_dead = True
                    missile.has_exploded = True

        fighter.remove_exploded_missles()
        enemy_fleet.remove_dead_badguys()

        if enemy_fleet.is_defeated:
            win_sound.play()
            enemy_rows = enemy_rows + 1
            enemy_fleet = EnemyFleet(screen, enemy_rows)

        # Check for your death!
        for badguy in enemy_fleet.badguys:
            if badguy.y + badguy.image.get_height() >= fighter.y:
                game_over = True
                lose_sound.play()

        pygame.display.update()


main()
