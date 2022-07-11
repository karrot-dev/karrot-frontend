// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

const oldLocation = global.location

delete global.location
global.location = {
  reload: jest.fn(),
  href: oldLocation.href,
  hash: oldLocation.hash,
}
