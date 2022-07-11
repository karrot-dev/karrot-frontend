// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

export default async () => {
  if (window.console && window.console.log) {
    const sansSerif = {
      fontFamily: 'sans-serif',
    }
    console.log(
      `
        %c
        Oh, hey there developer! 🙂

        %c
        Do you want to come and help us build our tool for grassroots initiatives?

        %c
            Forum → https://community.karrot.world
             Code → https://github.com/karrot-dev/karrot-frontend
             Chat → https://chat.karrot.world/channel/karrot-dev
      `.trim().replace(/^ {6}/gm, '').replace(/%c\n/g, '%c'),
      style({
        ...sansSerif,
        fontSize: '28px',
        color: '#F2C037',
      }),
      style({
        ...sansSerif,
        fontSize: '16px',
      }),
      style({
        color: '#888',
      }),
    )
  }

  function style (params) {
    return Object.entries(params).map(([key, value]) => [
      key.replace(/([A-Z])/g, (m, c) => '-' + c.toLowerCase()),
      value,
    ].join(':')).join(';')
  }
}
